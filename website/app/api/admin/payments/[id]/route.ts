import { NextRequest, NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid paymentId' }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findById(id).lean();
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const response = {
      id: payment._id.toString(),
      userId: payment.userId.toString(),
      amount: payment.amount,
      type: payment.type,
      method: payment.method,
      status: payment.status,
      paymentRef: payment.paymentRef,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createdAt: (payment as any).createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch payment detail error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
