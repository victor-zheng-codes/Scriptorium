import prisma from '../../../utils/prisma-client'
import { verifyToken } from '../../../utils/auth'

export default async function handler(req, res) {
  	if (req.method === 'GET') {
  	  	const authHeader = req.headers.authorization;
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
			return res.status(401).json({error: "Unauthorized"})
		}

		try {
			const userId = tokenVerificationResult;

			const userDetails = await prisma.user.findUnique({
				where: {
					userId: userId // Search for the user based on the provided userId
				}
			});

			const templates = await prisma.template.findMany({
			  where: {
				userId: userId, 
			  },
			}); 
	  
			const blogs = await prisma.blog.findMany({
			  where: {
				authorId: userId,
				isDeleted: false,
			  },
			}); 
			

			const { password: _, refreshToken: _2, ...userResponse } = userDetails;

			res.status(200).json({ message: 'Profile fetched', user: userResponse, blogs, templates });
		} catch (error) {
			console.log(error)
			res.status(500).json({ error: 'Error fetching profile' });
		}
  	} else {
 	   res.setHeader('Allow', ['GET']);
 	   return res.status(405).end(`Method ${req.method} Not Allowed`);
 	}
}