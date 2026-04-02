import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { authenticateAdminTempToken } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate temp token
    const authResult = await authenticateAdminTempToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();

    // 2. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 3. Compare password using bcryptjs
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Generate ADMIN JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

    // 5. Set cookie "token"
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 6. DELETE "admin_temp_token"
    response.cookies.set({
      name: 'admin_temp_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
