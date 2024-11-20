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

      if (tags){
          console.log("before tags: " + tags)
          tags = tags.split(",").map(function(item) {
            return item.trim();
          }).filter(function(item) {
            return item !== ''; // Remove empty strings
          });
          console.log("after tags: " + tags)

      }
      // tagString = tags ? tags.split(",").map((tag) => tag.trim()).join(",") : "";

      // console.log("stringified tags: " + tagString)

      return [
          content ? { content: { contains: content } } : undefined,
          title ? { title: { contains: title } } : undefined,
          description ? {description: {contains: description} }: undefined,
          language ? {language: {equals: language} }: undefined,
          tags && tags.length > 0 ? {
            AND: tags.map((tag) => ({
              templatesTags: {
                some: {
                  tag: {
                    tagName: { equals: tag }, // Case-insensitive match
                  },
                },
              },
            })),
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
          owner: {
            select: {
              firstName: true,
              lastName: true, // Include only firstName and lastName
              username: true,
            },
          },
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
      console.log("Error " + error)
      return res.status(500).json({ message: 'Internal server error'});
    }
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
