// todo return blogs and templates associated with the tag

import prisma from '../../../utils/prisma-client';

// const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        // let tagId = req.query;
        let {
            query: { tagId },
            method } = req;
        
        console.log(tagId)

        tagId = Number(tagId)
        if (!tagId) {
            return res.status(400).json({ error: 'tagId should be a valid integer.' });
        }

        const tagExists = await prisma.tag.findUnique({
            where: 
             {
                tagId: tagId
             }
        })

        if (!tagExists){
            return res.status(400).json({ error: 'tagId does not exist in database' });
        }

        const linkedBlogs = await prisma.blogTags.findMany({
            where: {
                tagId: tagId
            },
            include: {
              blog: true
            }
        }
        );

        const linkedTemplates = await prisma.templateTags.findMany({
            where: {
                tagId: tagId
            },
            include: {
              template: true
            }
         }
        );

      return res.status(200).json({linkedBlogs: linkedBlogs, linkedTemplates: linkedTemplates});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error when retrieving tags' });
    }
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
