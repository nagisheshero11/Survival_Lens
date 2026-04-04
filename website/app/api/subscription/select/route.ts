import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Subscription from '@/models/Subscription';
import UserPricing from '@/models/UserPricing';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { regenerateUserPricing } from '@/lib/userPricing';

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

    if (rawBody && typeof rawBody === 'object' && 'amount' in rawBody) {
      return NextResponse.json({ message: 'Manual amount is not allowed. Select a plan only.' }, { status: 400 });
    }

    const { planType } = rawBody;
    if (!planType || typeof planType !== 'string') {
      return NextResponse.json({ message: 'Invalid planType' }, { status: 400 });
    }

    const normalizedPlanType = planType.toLowerCase();
    if (!['basic', 'standard', 'premium'].includes(normalizedPlanType)) {
      return NextResponse.json({ message: 'Invalid plan type. Must be basic, standard, or premium.' }, { status: 400 });
    }

    await connectDB();

    // Verify KYC status
    const userDoc = await User.findById(currentUser._id);
    if (!userDoc || userDoc.kyc.status !== 'approved') {
      return NextResponse.json({ message: "KYC must be approved to select a premium plan" }, { status: 403 });
    }

    let userPricing = await UserPricing.findOne({ userId: currentUser._id });
    if (!userPricing || !Array.isArray(userPricing.plans) || userPricing.plans.length === 0) {
      userPricing = await regenerateUserPricing({
        userId: currentUser._id,
        city: userDoc.kyc?.city,
        avgWeeklyIncome: userDoc.kyc?.avgWeeklyIncome
      });
    }

    const matchedPlan = userPricing.plans.find((plan) => plan.planType === normalizedPlanType);
    if (!matchedPlan) {
      return NextResponse.json({ message: 'Chosen plan type not found in pricing.' }, { status: 400 });
    }

    userPricing.selectedPlan = {
      planType: matchedPlan.planType,
      price: matchedPlan.price,
      benefitAmount: matchedPlan.benefitAmount
    };
    await userPricing.save();

    const planNameMap: Record<string, string> = {
      basic: 'Basic',
      standard: 'Standard',
      premium: 'Premium'
    };
    const planName = planNameMap[normalizedPlanType] || 'Basic';

    // Check if subscription exists and upsert
    const subscription = await Subscription.findOneAndUpdate(
      { userId: currentUser._id },
      {
        $set: {
          planAmount: matchedPlan.price,
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
