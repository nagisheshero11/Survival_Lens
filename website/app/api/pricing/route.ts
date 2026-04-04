import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import UserPricing from '@/models/UserPricing';
import connectDB from '@/lib/db';
import { hasValidPricingPlans, regenerateUserPricing } from '@/lib/userPricing';

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
    
    let userPricing = await UserPricing.findOne({ userId: currentUser._id });
    if (!userPricing || !hasValidPricingPlans(userPricing.plans)) {
      try {
        userPricing = await regenerateUserPricing({
          userId: currentUser._id,
          city: currentUser.kyc?.city,
          avgWeeklyIncome: currentUser.kyc?.avgWeeklyIncome
        });
      } catch (pricingErr: unknown) {
        const message = pricingErr instanceof Error ? pricingErr.message : 'Unable to generate pricing';
        return NextResponse.json({ message }, { status: 503 });
      }
    }

    return NextResponse.json({ 
       plans: userPricing.plans,
       selectedPlan: userPricing.selectedPlan
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
