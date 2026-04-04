import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import User from '@/models/User';
import UserPricing from '@/models/UserPricing';
import connectDB from '@/lib/db';
import { hasValidPricingPlans, regenerateUserPricing } from '@/lib/userPricing';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await connectDB();

    const userDoc = await User.findById(currentUser._id);
    if (!userDoc || userDoc.kyc?.status !== 'approved') {
      return NextResponse.json({ message: 'KYC must be approved before recalculation.' }, { status: 403 });
    }

    const companies = Array.isArray(userDoc.kyc?.companies) ? userDoc.kyc.companies : [];
    const selectedCompany =
      companies.find((company) => company.verified && company.partnerId) ||
      companies.find((company) => company.partnerId) ||
      null;
    const partnerId = String(selectedCompany?.partnerId || '').trim();

    if (!partnerId) {
      return NextResponse.json({ message: 'Worker profile not available for pricing.' }, { status: 404 });
    }

    const existingPricing = await UserPricing.findOne({ userId: currentUser._id });
    if (existingPricing?.selectedPlan?.planType) {
      return NextResponse.json(
        { message: 'Pricing is locked after plan selection.' },
        { status: 409 }
      );
    }

    let refreshed;
    try {
      refreshed = await regenerateUserPricing({
        userId: currentUser._id,
        partnerId,
      });
    } catch {
      return NextResponse.json(
        { message: 'Unable to fetch pricing. Try again.' },
        { status: 503 }
      );
    }

    if (!hasValidPricingPlans(refreshed.plans)) {
      return NextResponse.json(
        { message: 'Unable to fetch pricing. Try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: 'Pricing recalculated successfully',
        plans: refreshed.plans,
        selectedPlan: refreshed.selectedPlan,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
