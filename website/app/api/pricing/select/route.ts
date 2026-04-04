import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import UserPricing from '@/models/UserPricing';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import connectDB from '@/lib/db';

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

    const { planType } = rawBody;

    if (!planType || typeof planType !== 'string') {
      return NextResponse.json({ message: "Invalid planType" }, { status: 400 });
    }
    
    const normalizedPlanType = planType.toLowerCase();

    if (!['basic', 'standard', 'premium'].includes(normalizedPlanType)) {
      return NextResponse.json({ message: "Invalid plan type. Must be basic, standard, or premium." }, { status: 400 });
    }

    await connectDB();

    // Verify KYC status
    const userDoc = await User.findById(currentUser._id);
    if (!userDoc || userDoc.kyc.status !== 'approved') {
      return NextResponse.json({ message: "KYC must be approved to select a premium plan" }, { status: 403 });
    }

    const userPricing = await UserPricing.findOne({ userId: currentUser._id });
    if (!userPricing) {
       return NextResponse.json({ message: "Pricing data not found for user. Complete KYC first." }, { status: 404 });
    }

    const matchedPlan = userPricing.plans.find(p => p.planType === normalizedPlanType);
    if (!matchedPlan) {
       return NextResponse.json({ message: "Chosen plan type not found in pricing." }, { status: 400 });
    }

    // Update selected plan
    userPricing.selectedPlan = {
       planType: matchedPlan.planType,
       price: matchedPlan.price
    };
    await userPricing.save();

    // Mapping for Subscription planName (Capitalized)
    const planNameMap: Record<string, string> = {
       basic: 'Basic',
       standard: 'Standard',
       premium: 'Premium'
    };
    const capitalizedPlanName = planNameMap[normalizedPlanType] || 'Basic';

    // Check if subscription exists and upsert
    const subscription = await Subscription.findOneAndUpdate(
      { userId: currentUser._id },
      {
        $set: {
          planAmount: matchedPlan.price,
          planName: capitalizedPlanName,
          status: 'active',
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
      selectedPlan: userPricing.selectedPlan,
      subscription 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Pricing Select Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
