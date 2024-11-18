import prisma from '../../../utils/prisma-client';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const { authorId } = req.query;
    // authorId is a string

    // Pagination code generated by ChatGPT, with some modification
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1; // Ensure page is at least 1
    if (limit < 1) limit = 1; // Ensure limit is at least 1

    const skip = (page - 1) * limit; // Calculate the number of records to skip
    const take = limit; // The number of records to return
    
    try {
        const blogs = await prisma.blog.findMany({
            where: {
                authorId
            },
            include: { // Include the Blog's tags and templates when returning it
                BlogTags: {
                    include: {
                        tag: true, // Include tag info
                    },
                },
                BlogTemplate: {
                    include: {
                        template: true, // Include template info
                    },
                },
            },
            skip: skip,
            take: take,
        });

        const totalCount = await prisma.blog.count({ // Get the total count to display on the page
            where: {
                AND: whereConditions
            },
        });
        const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

        return res.status(200).json({ blogs, totalCount, totalPages, page, limit });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error searching for blogs" });
    }
}