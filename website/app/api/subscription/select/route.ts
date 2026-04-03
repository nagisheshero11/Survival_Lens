import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import connectDB from '@/lib/db';

const PLAN_MAP: Record<number, string> = {
  90: 'Basic',
  110: 'Standard',
  150: 'Premium'
};

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let rawBody;
    try {
      rawBody = await request.json();
    } catch (_e) {
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { amount } = rawBody;

    if (!amount || !PLAN_MAP[amount]) {
      return NextResponse.json({ message: "Invalid plan amount. Must be 90, 110, or 150." }, { status: 400 });
    }

    await connectDB();

    // Verify KYC status
    const userDoc = await User.findById(currentUser._id);
    if (!userDoc || userDoc.kyc.status !== 'approved') {
      return NextResponse.json({ message: "KYC must be approved to select a premium plan" }, { status: 403 });
    }

    const planName = PLAN_MAP[amount];

    // Check if subscription exists and upsert
    const subscription = await Subscription.findOneAndUpdate(
      { userId: currentUser._id },
      {
        $set: {
          planAmount: amount,
          planName: planName,
          status: 'active',
          // Note: totalPayments and duePayments are set to 0 ONLY if inserted (setOnInsert), OR we reset them?
          // The prompt says "If exists -> update plan. Else -> create new." 
          // It also says "Initialize: startDate = now, lastPaymentDate = null, totalPayments = 0, duePayments = 0, status = active".
          // In the update case, does it reset? "Initialize:" implies for new ones. 
          // We will reset them if users switch plans, as requested logic doesn't specify carry-over. Let's just set all to init for simplicity when selecting a plan.
          startDate: new Date(),
          lastPaymentDate: null,
          totalPayments: 0,
          duePayments: 0
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      message: "Subscription selected", 
      subscription 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Subscription Select Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
