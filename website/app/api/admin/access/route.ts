import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Hardcoded credentials for Stage 1 Temporary Access
    if (username !== 'admin' || password !== 'admin123') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate temporary token
    const tempToken = crypto.randomBytes(32).toString('hex');

    const response = NextResponse.json({ message: 'Access granted' }, { status: 200 });

    response.cookies.set({
      name: 'admin_temp_token',
      value: tempToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Admin Access Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
