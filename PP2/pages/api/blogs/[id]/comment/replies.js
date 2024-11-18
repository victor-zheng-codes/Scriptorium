import prisma from '../../../../../utils/prisma-client'
// Function to validate that the input is a valid integer
function isValidInteger(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && String(parsed) === String(value).trim();
}

// Portions of the file were generated by ChatGPT with modification
export default async function handler(req, res) {
    if (req.method === 'GET') {
        let { commentId } = req.query; // Expecting comment ID in the request query
        
        // Validate comment ID
        if (!isValidInteger(commentId)) {
            return res.status(400).json({ error: 'Comment ID should be a valid integer.' });
        }

        commentId = Number(commentId)

        try {
            // Fetch replies associated with the given comment ID
            const replies = await prisma.commentReply.findMany({
                where: {
                    commentId: commentId // Match replies to the provided comment ID
                },
                select: {
                    replyId: true,
                    reply: {
                        select: {
                            commentId: true,
                            content: true, // Select the content from the Comment model
                            upvotes: true,  // Include upvotes from the Comment model
                            downvotes: true, // Include downvotes from the Comment model
                            user: { // Access the user relation to get the username
                                select: {
                                    username: true // Include username from the User model
                                }
                            }
                        },
                    }
                },
                orderBy: [
                    { reply: { upvotes: 'desc' } },  // First sort by reply's upvotes in descending order
                    { reply: { downvotes: 'desc' } }, // Then sort by reply's downvotes in descending order
                ],
            });

            // Check if there are no replies
            if (!replies || replies.length === 0) {
                return res.status(404).json({ message: 'No replies found for this comment.' });
            }

            return res.status(200).json({
                message: 'Successfully retrieved replies',
                replies: replies
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while retrieving replies.' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}