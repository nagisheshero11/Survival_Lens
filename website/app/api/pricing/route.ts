import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import UserPricing from '@/models/UserPricing';
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
    
    const userPricing = await UserPricing.findOne({ userId: currentUser._id });
    if (!userPricing) {
       // if we want to fallback just in case they didn't do KYC or pricing failed
       return NextResponse.json({ 
          plans: [
            { planType: 'basic', price: 90 },
            { planType: 'standard', price: 110 },
            { planType: 'premium', price: 150 }
          ],
          selectedPlan: null
       }, { status: 200 });
    }

    return NextResponse.json({ 
       plans: userPricing.plans,
       selectedPlan: userPricing.selectedPlan
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
