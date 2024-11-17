import { verifyToken } from '../../../utils/auth'; 

import prisma from '../../../utils/prisma-client'

export default async function handler(req, res) {
  let {
    query: { templateId },
    method } = req;

    templateId = parseInt(templateId)

  // handle get request for the specific template. returns just the template
  if (method === 'GET') {
    try {
      const template = await prisma.template.findUnique({
        where: { 
            templateId: templateId},
      });

      if (!template) {
        return res.status(404).json({ message: `Template with templateId ${templateId} not found` });
      }

      const templateTags = await prisma.templateTags.findMany({
        where: { 
            templateId
          },
      });

      res.status(200).json({template, templateTags}); // Returns template along with associated blogs
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  // handle patch request to the template
  else if (req.method === 'PATCH') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = verifyToken(token); // Verify token and get user ID

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let { title, content, tags, language, description} = req.body;

    if (!title && !content && !tags && !language && !description){
      return res.status(400).json({ message: 'Missing at least one of title, content, tags, language, or description.' });
    }

    const existingTemplate = await prisma.template.findUnique({
      where: {
        templateId, 
      },
    });

    // check if the template with id already exists
    if (!existingTemplate){
      return res.status(400).json({ message: 'Template with id does not exist.' });
    }

    // check if the user is the owner of the template
    if (existingTemplate.userId !== userId){
      return res.status(400).json({ message: 'Only owners of template can modify template.' });
    }

    // check if the title is empty
    if (!title){
      title = existingTemplate.title;
    }
    else{
      // check if provided title is unique
      const existingTitle = await prisma.template.findMany({
        where: {
            AND: [ {title: title} ], 
            NOT: [{templateId}]
        },
      });

      console.log(existingTitle)
  
      // if there are more than zero titles with same title, then return error message
      if (existingTitle.length !== 0){
        return res.status(400).json({ message: 'Template with provided title already exists.' });
      }
    }
    
    let returnJson = {}

    // update title, content, language, description if they are provided
    if (title || content || language || description){


      const date = new Date()
      const estOffset = -5 * 60;
      const utcOffset = date.getTimezoneOffset(); 
      const estDate = new Date(date.getTime() + (estOffset + utcOffset) * 60 * 1000); 

      try {
        const updatedTemplate = await prisma.template.update({
          where: { templateId: templateId },
          data: {
            title,
            content,
            language,
            description,
            updatedAt: estDate.toISOString()
          },
        });

        // add to the json
        returnJson.updatedTemplate = updatedTemplate;

      }catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Error updating template' });
      }
    }

    // if there are new tags to update
    if (tags){
      // first we will delete all tags associated with this template
      await prisma.templateTags.deleteMany({
        where: {templateId}
      })

      // go through and remap every tag associated with this template
      try {
        // For each tag name
        for (let inputTagName of tags) {

          if (typeof(inputTagName) !== "string"){
             return res.status(400).json({ message: 'Tags provided must be strings' });
          }

          // Find the tag
          let tag = await prisma.tag.findUnique({ where: { tagName: inputTagName } });
          
          // If the tag does not exist, create the tag
          if (tag === null) {
              tag = await prisma.tag.create({
                  data: {
                      tagName: inputTagName
                  },
              });
          }

          // Connect the tag to the blog
          await prisma.templateTags.create({
              data: {
                  tagId: tag.tagId,
                  templateId: templateId
              },
            });
        }
        returnJson.tagsRemapped = tags
      }
      catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating tags for the template' });
      }
    } 
    return res.status(200).json(returnJson);
  }
  else if (req.method === 'POST') { // forking templates
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = verifyToken(token); // Verify token and get user ID

    // forking just requires you to login
    // if (!userId) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    try {
      const originalTemplate = await prisma.template.findUnique({
        where: { templateId: parseInt(templateId) },
      });

      if (!originalTemplate) {
        return res.status(404).json({ message: `Template with templateId ${templateId} not found` });
      }

      // fork ensure that it is unique
      const date = new Date()
      const estOffset = -5 * 60;
      const utcOffset = date.getTimezoneOffset(); 
      const estDate = new Date(date.getTime() + (estOffset + utcOffset) * 60 * 1000); 

      const newTemplate = await prisma.template.create({
        data: {
          title: `${originalTemplate.title} (Forked) ${estDate}`,
          content: originalTemplate.content,
          userId,
          description: originalTemplate.description,
          language: originalTemplate.language
        },
      });

      // go through and remap every tag associated with this template
      try {

        const tags = await prisma.templateTags.findMany({
          where: {templateId: 
            originalTemplate.templateId},
            include: {tag: true}
        })

        // For each tag name
        for (let inputTag of tags ) {
          // Find the tag
          let tag = await prisma.tag.findUnique({ where: { tagName: inputTag.tag.tagName } });

          // Connect the tag to the blog
          await prisma.templateTags.create({
              data: {
                  tagId: tag.tagId,
                  templateId: newTemplate.templateId
              },
            });
          }
      }
      catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'Error updating tags for the template' });
      }

      return res.status(201).json(newTemplate);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error forking template' });
    }
  }
  else if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = verifyToken(token); // Verify token and get user ID

    console.log(userId)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // retrieve the template if it exists
    const originalTemplate = await prisma.template.findUnique({
      where: { templateId: parseInt(templateId) },
    });

    if (!originalTemplate) {
      return res.status(404).json({ error: `Template with templateId ${templateId} not found` });
    }

    // check if the user is the owner of the template
    if (originalTemplate.userId !== userId){
      return res.status(400).json({ message: 'Only owners of template can delete the template.' });
    }

      try {
        const returnVal = await prisma.template.delete({
          where: {
            templateId
          }
        });

      return res.status(200).json({message: "Successfully deleted", deletedTemplate: returnVal})
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting template'});
    }
  }
  else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET', 'PATCH', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
