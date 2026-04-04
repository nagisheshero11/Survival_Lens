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

    const companies = Array.isArray(currentUser.kyc?.companies) ? currentUser.kyc.companies : [];
    const selectedCompany =
      companies.find((company) => company.verified && company.partnerId) ||
      companies.find((company) => company.partnerId) ||
      null;

    const partnerId = String(selectedCompany?.partnerId || '').trim();
    if (!partnerId) {
      return NextResponse.json({ message: 'Worker profile not available for pricing.' }, { status: 404 });
    }
    
    let userPricing = await UserPricing.findOne({ userId: currentUser._id });
    if (!userPricing || !hasValidPricingPlans(userPricing.plans)) {
      try {
        userPricing = await regenerateUserPricing({
          userId: currentUser._id,
          partnerId,
        });
      } catch (_pricingErr: unknown) {
        return NextResponse.json({ message: 'Unable to fetch pricing. Try again.' }, { status: 503 });
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
