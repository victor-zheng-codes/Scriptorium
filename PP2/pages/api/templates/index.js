import prisma from '../../../utils/prisma-client';

export default async function handler(req, res) {
  let { title, content, language, description, tags, page = 1, limit = 10  } = req.query;

  page = Number(page)
  limit = Number(limit)

  if (page < 1) page = 1; // Ensure page is at least 1
  if (limit < 10) limit = 10; // Ensure limit is at least 10

  const skip = (page - 1) * limit; // Calculate the number of records to skip
  const take = limit; // The number of records to return

  if (req.method === 'GET') {
    const buildWhereConditions = () => {
      return [
          content ? { content: { contains: content } } : undefined,
          title ? { title: { contains: title } } : undefined,
          description ? {description: {contains: description} }: undefined,
          language ? {language: {contains: language} }: undefined,
          tags && tags.length > 0 ? {
            templatesTags: {
                  some: {
                      tag: {
                          tagName: { in: tags.split(',') },
                      },
                  },
              },
          } : undefined,
      ].filter(Boolean); // Remove undefined values (from non-existent parameters)
  };
  
  try {
      const whereConditions = buildWhereConditions();

      const templates = await prisma.template.findMany({
        where: {
          AND: whereConditions,
        },
        include: {
          templatesTags: {
            include: {
              tag: true, // Include tag info
            },
          },
          owner: true, // Include the owner information
        },
        skip: skip,
        take: take,
      });

      const totalCount = await prisma.template.count({ // Get the total count to display on the page
          where: {
              AND: whereConditions
          },
      })
      const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

      return res.status(200).json({ templates, totalPages, page, limit });
    } 
    catch (error) 
    {
      return res.status(500).json({ message: 'Internal server error' , error});
    }
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
