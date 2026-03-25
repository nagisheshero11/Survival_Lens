import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import connectDB from '@/lib/db';

export interface AuthResult {
  user?: IUser;
  error?: string;
  status?: number;
}

export const authenticateUser = async (request: NextRequest): Promise<AuthResult> => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized: No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is undefined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return { error: 'Unauthorized: User not found', status: 404 };
    }

    return { user };
  } catch (error) {
    return { error: 'Unauthorized: Invalid token', status: 401 };
  }
};
