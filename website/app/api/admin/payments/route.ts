import { NextRequest, NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (status) {
      query.status = status;
    }
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
      }
      query.userId = userId;
    }

    await connectDB();

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedPayments = payments.map((payment: any) => ({
      id: payment._id.toString(),
      userId: payment.userId.toString(),
      amount: payment.amount,
      type: payment.type,
      method: payment.method,
      status: payment.status,
      paymentRef: payment.paymentRef,
      createdAt: payment.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json(formattedPayments, { status: 200 });
  } catch (error) {
    console.error('Fetch payments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
