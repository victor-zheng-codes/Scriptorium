// import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth'; 
import prisma from '../../../utils/prisma-client';

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = verifyToken(token); // Verify token and get user ID

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, content, tags, language, description} = req.body;

    if (!title || !content || !tags || !language || !description) {
      return res.status(400).json({ message: 'Missing title, code content, tags, language, or description' });
    }

    const existingTemplate = await prisma.template.findUnique({
      where: {
        title, 
      },
    });

    if (existingTemplate){
      return res.status(400).json({ message: 'Template with the title provided already' });
    }

    try {
      // Create the template and connect all tags
      const template = await prisma.template.create({
        data: {
          title,
          content,
          userId,
          description,
          language
      }});

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
                  templateId: template.templateId
              },
            });
          }
        }
        catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error mapping tags' });
        }

      // if the template is successfully created
      return res.status(201).json({template: template, tags: tags});

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating template' });
    }
  }
  else{
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
