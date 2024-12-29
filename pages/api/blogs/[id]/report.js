import { authenticateUser } from '../../../../utils/auth'
import prisma from '../../../../utils/prisma-client'
import { isValidId } from '../../../../utils/validation';

export default async function handler(req, res) {
    // Authenticate user
    let userId = authenticateUser(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if method is allowed
    if (req.method !== "POST") {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
    const { explanation = "" } = req.body;
    let { commentId } = req.body;
    let blogId = req.query.id;
    if ((!commentId && !blogId)) {
        return res.status(400).json({ error: "Blog or comment ID is required" });
    }
    if (!userId || !isValidId(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    userId = Number(userId);
    if (typeof explanation !== "string") {
        return res.status(400).json({ error: "explanation must be a string" });
    }

    if (!isValidId(blogId)) {
        return res.status(400).json({ error: "Invalid blog ID" });
    }
    blogId = Number(blogId);
    // Check if the blog exists
    const blog = await prisma.blog.findUnique({
        where: { blogId: blogId },
    });

    if (!blog) { // Blog does not exist
        return res.status(404).json({ error: `Blog ${blogId} not found` });
    }

    // Code to generate reports generated by ChatGPT, with some modification
    if (commentId) { // Reporting a comment
        if (!isValidId(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }
        commentId = Number(commentId);
        try {
            // Check if the comment exists and is on the current blog
            const comment = await prisma.comment.findUnique({
                where: { commentId: commentId },
            });
            if (!comment) { // Comment does not exist
                return res.status(404).json({ error: `Comment ${commentId} not found` });
            } else if (comment.blogId !== blogId) { // Comment is not on the current blog
                return res.status(404).json({ error: `Comment ${commentId} is not on blog ${blogId}` });
            }

            // Create the commentReport
            const newCommentReport = await prisma.commentReport.create({
                data: {
                    userId,
                    commentId,
                    explanation,
                },
            });

            return res.status(201).json({ newCommentReport });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Error creating report" });
        }
        
    } else { // Reporting a blog
        try {
            // Create the blogReport
            const newBlogReport = await prisma.blogReport.create({
                data: {
                    userId,
                    blogId,
                    explanation,
                },
            });

            return res.status(201).json({ newBlogReport });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Error creating report" });
        }
    }
}