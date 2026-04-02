import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { userId } = await request.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.kyc.status = 'approved';
    user.kyc.updatedAt = new Date();
    await user.save();

    return NextResponse.json({ message: 'KYC approved' }, { status: 200 });
  } catch (error) {
    console.error('Approve KYC error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
