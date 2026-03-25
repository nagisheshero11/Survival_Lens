import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { validateLoginInput, LoginInput } from '@/utils/validators';
import generateToken from '@/utils/generateToken';

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Parse request body
    const body: LoginInput = await request.json();
    const { email, mobile, password } = body;

    // 3. Validate input
    const validation = validateLoginInput({ email, mobile, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    const safePassword = password as string;

    // 4. Find user by email or mobile
    const query = email ? { email: email.toLowerCase() } : { mobile };
    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    // 5. Compare password using bcrypt
    const isMatch = await bcrypt.compare(safePassword, user.password as string);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    // 6. Generate JWT token
    const token = generateToken(user._id, user.email);

    // 7. Return response
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
