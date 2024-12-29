import { authenticateUser } from '../../../../../utils/auth'
import prisma from '../../../../../utils/prisma-client'
import { isValidId } from '../../../../../utils/validation';

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

    let { rating, commentId } = req.body;
    let blogId = req.query.id;
    if (!blogId || !isValidId(blogId)) {
        return res.status(400).json({ error: "Invalid blog ID" });
    }
    if (!userId || !isValidId(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    if (!commentId || !isValidId(commentId)) {
        return res.status(400).json({ error: "Invalid comment ID" })
    }
    if (rating != 1 && rating != 0 && rating != -1) {
        return res.status(400).json({ error: "Rating must be 1 for upvote, -1 for downvote or 0 to remove rating" })
    }
    blogId = Number(blogId);
    userId = Number(userId);
    commentId = Number(commentId);
    rating = Number(rating);

    try {
        // Check if the blog exists
        const blog = await prisma.blog.findUnique({
            where: { blogId },
        });
        if (!blog) { // Blog does not exist
            return res.status(404).json({ error: `Blog ${blogId} not found` });
        }

        // Check if the comment exists and is on the current blog
        const comment = await prisma.comment.findUnique({
            where: { commentId: commentId },
        });
        if (!comment) { // Comment does not exist
            return res.status(404).json({ error: `Comment ${commentId} not found` });
        } else if (comment.blogId !== blogId) { // Comment is not on the current blog
            return res.status(404).json({ error: `Comment ${commentId} is not on blog ${blogId}` });
        }

        // Get the previous rating on this comment made by this user, if it exists
        const commentRating = await prisma.userCommentRating.findUnique({
            where: {
                userId_commentId: {
                    userId: userId,
                    commentId: commentId
                }
            }
        });
        if (commentRating) {
            // Delete the previous rating on this comment made by this user
            await prisma.userCommentRating.delete({
                where: {
                    userId_commentId: {
                        userId: userId,
                        commentId: commentId
                    }
                },
            });

            let data = {};
            if (commentRating.rating === 1 && rating === 0) {
                data.upvotes = { decrement: 1 }
            } else if (commentRating.rating === -1 && rating === 0) {
                data.downvotes = { decrement: 1 }
            }
            if (Object.keys(data).length > 0) { // Only update if there are changes
                await prisma.comment.update({
                    where: {
                        commentId,
                    },
                    data,
                });
            } 
        }  

        if (rating == 0) { // Return because we just want to remove the rating
            return res.status(200).json({ newRating: null });
        }

        // Create new rating
        const newRating = await prisma.userCommentRating.create({
            data: {
                userId,
                commentId,
                rating,
            }
        });

        // Update comment's upvotes and downvotes
        let data = {};
        if (commentRating) {
            if (commentRating.rating === 1 && rating === -1) {
                data.upvotes = { decrement: 1 };
                data.downvotes = { increment: 1 };
            } else if (commentRating.rating === -1 && rating === 1) {
                data.upvotes = { increment: 1 };
                data.downvotes = { decrement: 1 };
            }
        } else {
            if (rating === -1) {
                data.downvotes = { increment: 1 };
            } else if (rating === 1) {
                data.upvotes = { increment: 1 };
            }
        }
        if (Object.keys(data).length > 0) { // Only update if there are changes
            await prisma.comment.update({
                where: {
                    commentId,
                },
                data,
            });
        }

        return res.status(201).json({ newRating });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating/deleting rating" });
    }
}
