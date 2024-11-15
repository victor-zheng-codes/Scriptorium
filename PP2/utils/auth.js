// utils/auth.js
import jwt from 'jsonwebtoken';
import prisma from './prisma-client.js'

const JWT_SECRET = process.env.JWT_SECRET; 
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

export function verifyToken(token) {
  try {
      // Verify the token and decode the payload
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId; // Return decoded token if valid
  } catch (err) {
      // Handle errors such as expired or invalid tokens
      if (err.name === 'TokenExpiredError') {
          console.error('Access token has expired');
      } else if (err.name === 'JsonWebTokenError') {
          console.error('Invalid access token');
      } else {
          console.error('An error occurred while verifying the token:', err.message);
      }
      return null; // Return null for any verification errors
  }
}

export function authenticateUser(req) {
  const authHeader = req.headers.authorization;

  // Validate that the user is authenticated
  if (!authHeader) {
      return null; // Return null for unauthorized
  }

  // Check if the header is in Bearer token format
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
      return null; // Return null for unauthorized
  }

  // Proceed with token verification
  const userId = verifyToken(token);
  
  // Check if the token is valid and userId exists
  if (!userId) {
      return null; // Return null for unauthorized
  }

  return userId;
}

export async function refreshAccessToken(refreshToken) {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); 

    // Find the user based on the userId in the decoded refresh token payload
    const user = await prisma.user.findUnique({ where: { userId: decoded.userId } });

    if (!user || user.refreshToken !== refreshToken) {
      return null; // Refresh token is invalid or doesn't match the stored token (a token from a different session is used)
    }

    // Generate a new refresh token
    const newRefreshToken = jwt.sign({ userId: user.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
    const newAccessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '15m' });

    return { "refreshToken": newRefreshToken, "accessToken": newAccessToken,  "userId": user.userId }; // Return the new access token

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Refresh token has expired');
    } else {
      console.error('Error refreshing access token:', error);
    }
    return null; // Return null if the refresh token is invalid or expired
  }
}