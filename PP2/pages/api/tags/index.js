import prisma from '../../../utils/prisma-client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      let { page = 1, limit = 10 } = req.query;
      page = Number(page)
      limit = Number(limit)

      if (page < 1) page = 1; // Ensure page is at least 1
      if (limit < 10) limit = 10; // Ensure limit is at least 10

      const skip = (page - 1) * limit; // Calculate the number of records to skip
      const take = limit; // The number of records to return

      const tags = await prisma.tag.findMany({
        skip: skip,
        take: take,
       });

       const totalCount = await prisma.tag.count()

       const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

      return res.status(200).json({tags, totalPages, page, limit});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
