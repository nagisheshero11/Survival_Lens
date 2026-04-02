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

    // 2. Validate input
    const { fullName, email, mobile, password } = await request.json();

    if (!fullName || !email || !mobile || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 409 });
    }

    // 3. Hash password using bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // 4. Save admin in DB
    const admin = new Admin({
      fullName,
      email,
      mobile,
      password: hashedPassword,
    });
    await admin.save();

    // 5. Generate ADMIN JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Usually a bit longer for permanent token
    );

    const response = NextResponse.json({ message: 'Admin created' }, { status: 201 });

    // 6. Set cookie for token
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 7. DELETE "admin_temp_token" cookie
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
    console.error('Admin Signup Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
