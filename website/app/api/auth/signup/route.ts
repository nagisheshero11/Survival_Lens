import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { validateSignupInput, SignupInput } from '@/utils/validators';
import generateToken from '@/utils/generateToken';

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Parse request body
    const body: SignupInput = await request.json();
    const { fullName, mobile, email, password } = body;

    // 3. Validate input
    const validation = validateSignupInput({ fullName, mobile, email, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Since we validated, we know they are available as strings:
    const safeEmail = email as string;
    const safePassword = password as string;

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email: safeEmail.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // 5. Hash password using bcrypt (salt rounds: 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(safePassword, salt);

    // 6. Create new user & 7. Save to DB
    const newUser = new User({
      fullName,
      mobile,
      email: safeEmail,
      password: hashedPassword
      // kyc defaults will be automatically set to status: "not_started"
    });

    const savedUser = await newUser.save();

    // 8. JWT Token Generation
    const token = generateToken(savedUser._id, safeEmail);

    // 9. Response Format
    return NextResponse.json({
      token,
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
