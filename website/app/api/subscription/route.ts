import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Subscription from '@/models/Subscription';
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

    const subscription = await Subscription.findOne({ userId: currentUser._id });
    
    if (!subscription) {
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    // Dynamic Due Payments Calculation (Weekly Logic)
    const now = new Date();
    const diffFromStart = now.getTime() - subscription.startDate.getTime();
    const daysFromStart = Math.floor(diffFromStart / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysFromStart / 7);

    // Compute due payments
    let calculatedDues = weeksPassed - subscription.totalPayments;
    if (calculatedDues < 0) {
      calculatedDues = 0;
    }

    if (subscription.duePayments !== calculatedDues) {
      subscription.duePayments = calculatedDues;
      await subscription.save();
    }

    return NextResponse.json({
      planAmount: subscription.planAmount,
      planName: subscription.planName,
      totalPayments: subscription.totalPayments,
      duePayments: subscription.duePayments,
      status: subscription.status,
      lastPaymentDate: subscription.lastPaymentDate ? subscription.lastPaymentDate.toISOString() : null,
      startDate: subscription.startDate.toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Subscription GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
