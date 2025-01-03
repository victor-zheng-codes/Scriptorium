import prisma from '../../../utils/prisma-client'
import { verifyToken } from '../../../utils/auth';

// Validation helper functions generated by ChatGPT
// Portions of the file were generated by ChatGPT with modification
function isValidBlogTitle(title) {
    // Title should be between 5 and 100 characters, allowing alphanumeric and spaces
    const titleRegex = /^[a-zA-Z0-9\s]{5,100}$/;
    return titleRegex.test(title);
}

function isValidBlogDescription(description) {
    // Description should be between 0 and 100 characters, allowing alphanumeric, spaces, and basic punctuation
    const descriptionRegex = /^[a-zA-Z0-9\s.,!?'@%&()\u2018\u2019\u2013-]{0,100}$/;
    return descriptionRegex.test(description);
}

function isValidBlogContent(content) {
    // Content should be between 20 and 1000 characters, allowing alphanumeric, spaces, and basic punctuation
    const contentRegex = /^[a-zA-Z0-9\s.,!?'@%&()\u2018\u2019\u2013-]{20,1000}$/;
    return contentRegex.test(content);
}

function isValidTag(tag) {
    // Tags should only contain alphanumeric characters and spaces, and be between 1 and 20 characters
    const tagRegex = /^[a-zA-Z0-9\s]{1,20}$/;
    return tagRegex.test(tag);
}

function areValidTags(tags) {
    // Validate an array of tags, return false if any tag is invalid
    if (!Array.isArray(tags)) {
        return false;
    }
    return tags.every(isValidTag);
}

function isValidInteger(value) {
    // Convert value to number and check if it's a valid integer
    const parsed = Number(value);
    return Number.isInteger(parsed) && String(parsed) === String(value).trim();
}

function areValidIntegers(integers) {
    // Validate an array of tags, return false if any tag is invalid
    if (!Array.isArray(integers)) {
        return false;
    }
    return integers.every(isValidInteger);
}
  
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const authHeader = req.headers.authorization;
        const { title, description, content, tags, templateIds } = req.body;

        // Validate that the user is authenticated
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if the header is in Bearer token format
        const [scheme, token] = authHeader.split(' ');
        
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Proceed with token verification
        let tokenVerificationResult = verifyToken(token);
        // Check if the token is valid
        if (tokenVerificationResult === null) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Valid title
        if (!isValidBlogTitle(title)) {
            return res.status(400).json({ error: 'Title must be between 5 and 100 characters, with only alphanumeric and spaces' });
        }
    
        // Validate description
        if (!isValidBlogDescription(description)) {
            return res.status(400).json({ error: 'Description should be between 0 and 100 characters, with only alphanumeric, spaces, and basic punctuation' });
        }

        // Validate content
        if (!isValidBlogContent(content)) {
            return res.status(400).json({ error: 'Content should be between 20 and 1000 characters, with only alphanumeric, spaces, and basic punctuation' });
        }
    
        // Validate tags
        if (!areValidTags(tags)) {
            return res.status(400).json({ error: 'Tags should only contain alphanumeric characters and spaces, and be between 1 and 20 characters' });
        }

        // Validate template
        if (!areValidIntegers(templateIds)) {
            return res.status(400).json({ error: 'TemplateIds should be integers.' });
        }

        try {
            // Create the blog
            const blog = await prisma.blog.create({
                data: {
                    title,
                    description,
                    content,
                    authorId: tokenVerificationResult
                },
            });
            
            // For each tag name
            for (let inputTagName of tags) {
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
                await prisma.blogTags.create({
                    data: {
                        tagId: tag.tagId,
                        blogId: blog.blogId
                    },
                });
            }

            // For each template id
            for (let inputTemplateId of templateIds) {
                // Find the tempate
                let template = await prisma.template.findUnique({ where: { templateId: inputTemplateId } });
                
                // If the template does not exist, return an error
                if (template === null) {
                    return res.status(400).json({ error: `Template ${inputTemplateId} not found.` });
                }

                // Connect the template to the blog
                await prisma.blogTemplate.create({
                    data: {
                        templateId: template.templateId,
                        blogId: blog.blogId
                    },
                });
            }

            res.status(201).json({ message: 'Blog created', blogId: blog.blogId });

        } catch (error) {
            if (error.code === 'P2002') { // Prisma's unique constraint error code
                // checks if the uniqueness error was caused by the email or username 
                if (error.meta.target.includes('tagName')) {
                    return res.status(409).json({ error: 'TagName already in use.' });
                }
            } else {
                console.log(error)
                return res.status(500).json({ error: 'Error creating blog and or tags' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
