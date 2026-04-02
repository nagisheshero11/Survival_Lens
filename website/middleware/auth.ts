import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import Admin, { IAdmin } from '@/models/Admin';
import connectDB from '@/lib/db';

export interface AuthResult {
  user?: IUser;
  error?: string;
  status?: number;
}

export const authenticateUser = async (request: NextRequest): Promise<AuthResult> => {
  try {
    let token = request.cookies.get('token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    if (!token) {
      return { error: 'Unauthorized: No token provided', status: 401 };
    }

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
  } catch (_error) {
    return { error: 'Unauthorized: Invalid token', status: 401 };
  }
};

export interface AdminAuthResult {
  admin?: IAdmin;
  error?: string;
  status?: number;
}

export const authenticateAdminTempToken = async (request: NextRequest): Promise<{ error?: string; status?: number; valid?: boolean }> => {
  const token = request.cookies.get('admin_temp_token')?.value;

  if (!token) {
    return { error: 'Unauthorized: No temporary token provided or token expired', status: 401 };
  }

  return { valid: true };
};

export const authenticateAdmin = async (request: NextRequest): Promise<AdminAuthResult> => {
  try {
    let token = request.cookies.get('token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return { error: 'Unauthorized: No token provided', status: 401 };
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is undefined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string, role?: string };
    
    if (decoded.role !== 'admin') {
      return { error: 'Forbidden: Admin access only', status: 403 };
    }

    await connectDB();
    const admin = await Admin.findById(decoded.userId).select('-password');
    
    if (!admin) {
      return { error: 'Unauthorized: Admin not found', status: 404 };
    }

    return { admin };
  } catch (_error) {
    return { error: 'Unauthorized: Invalid admin token', status: 401 };
  }
};
