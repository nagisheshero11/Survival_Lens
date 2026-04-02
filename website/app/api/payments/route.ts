import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Payment from '@/models/Payment';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await connectDB();
    
    // Returns explicit projections explicitly avoiding properties like _id naturally
    const payments = await Payment.find({ userId: currentUser._id })
      .select('amount status paymentRef createdAt -_id')
      .sort({ createdAt: -1 });

    return NextResponse.json(payments, { status: 200 });

  } catch (error: any) {
    console.error('Payments GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
