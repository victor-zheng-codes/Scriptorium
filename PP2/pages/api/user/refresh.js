import { refreshAccessToken } from '../../../utils/auth'
import prisma from '../../../utils/prisma-client'


export default async function handler(req, res) {
  if (req.method === 'POST') {
    // const { userId } = req.body; // also sends the refreshToken in the body in case refreshing is needed
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
    let tokenVerificationResult = await refreshAccessToken(token);

    // Check if the token is valid
    if (tokenVerificationResult === null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // attempt to update the token in the database and return
    try {
      // Store refresh token in the database
      await prisma.user.update({
        where: { userId: tokenVerificationResult["userId"] },
        data: { refreshToken: tokenVerificationResult["refreshToken"] }
      });

      // Send tokens to user
      return res.status(200).json({ 
        userId: tokenVerificationResult["userId"], 
        accessToken: tokenVerificationResult['accessToken'],
        refreshToken: tokenVerificationResult['refreshToken'],
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error refreshing token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}