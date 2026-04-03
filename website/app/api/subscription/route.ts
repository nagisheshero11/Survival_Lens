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
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }

    // Dynamic Due Payments Calculation
    const now = new Date();
    const referenceDate = subscription.lastPaymentDate || subscription.startDate;
    const diffTime = Math.abs(now.getTime() - referenceDate.getTime());
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If weekly cycle has passed
    if (daysPassed > 7) {
      const calculatedDues = Math.floor(daysPassed / 7);
      
      // Update DB with dynamically computed dues (this isn't additive, it's absolute based on time since last payment)
      // Wait, if lastPaymentDate is set, then since that point, 7 days means 1 payment due.
      // E.g., 8 days passed -> 1 due. 15 days passed -> 2 due.
      // What if they had previous duePayments that were not zero?
      // Since last payment resets duePayments to 0, it works correctly to just set it to floor(daysPassed/7).
      if (subscription.duePayments !== calculatedDues) {
        subscription.duePayments = calculatedDues;
        await subscription.save();
      }
    }

    return NextResponse.json({
      planAmount: subscription.planAmount,
      planName: subscription.planName,
      totalPayments: subscription.totalPayments,
      duePayments: subscription.duePayments,
      status: subscription.status,
      lastPaymentDate: subscription.lastPaymentDate ? subscription.lastPaymentDate.toISOString().split('T')[0] : null,
      startDate: subscription.startDate.toISOString().split('T')[0]
    }, { status: 200 });

  } catch (error: any) {
    console.error('Subscription GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
