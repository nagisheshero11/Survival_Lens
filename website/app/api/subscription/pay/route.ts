import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Subscription from '@/models/Subscription';
import connectDB from '@/lib/db';
import { POST as premiumPaymentAPI } from '@/app/api/payments/premium/route';
import { cookies } from 'next/headers';

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

    await connectDB();

    // 1. Fetch Subscription
    const subscription = await Subscription.findOne({ userId: currentUser._id });
    if (!subscription) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }

    // 2. Validate Status
    if (subscription.status !== 'active') {
      return NextResponse.json({ message: "Subscription is not active" }, { status: 400 });
    }

    // Weekly Validation
    const currentDate = new Date();
    if (subscription.lastPaymentDate) {
      const daysPassed = Math.floor((currentDate.getTime() - subscription.lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysPassed < 7) {
        return NextResponse.json({ message: "Payment already made for this week" }, { status: 400 });
      }
    }

    // Determine amount to charge
    const chargeAmount = subscription.planAmount;

    // We must pass authorization. Cookies are a safe bet if using the web app, but we also check headers.
    const authHeader = request.headers.get('authorization') || '';
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token')?.value || '';

    let headers: any = {
      'Content-Type': 'application/json'
    };

    if (authHeader) headers['Authorization'] = authHeader;
    if (tokenCookie) {
      // Just pass the cookie header string forward as cookies map
      headers['Cookie'] = `token=${tokenCookie}`;
    }

    // 3. Call existing Payment API using NextRequest spoofing
    const spoofedRequest = new NextRequest('http://localhost/api/payments/premium', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ amount: chargeAmount })
    });

    const paymentRes = await premiumPaymentAPI(spoofedRequest);
    
    // 4. On Success Workflow
    if (!paymentRes.ok) {
      const errorData = await paymentRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Payment process failed" }, 
        { status: paymentRes.status }
      );
    }

    const { paymentRef } = await paymentRes.json();

    // Update Subscription metrics
    const today = new Date();
    subscription.lastPaymentDate = today;
    subscription.totalPayments += 1;
    
    // Dynamic Due Payments Calculation (Weekly Logic)
    const diffFromStart = today.getTime() - subscription.startDate.getTime();
    const daysFromStart = Math.floor(diffFromStart / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysFromStart / 7);

    // Compute due payments
    let newDue = weeksPassed - subscription.totalPayments;
    if (newDue < 0) {
      newDue = 0;
    }
    subscription.duePayments = newDue;
    
    await subscription.save();

    return NextResponse.json({ 
      message: "Premium subscription paid successfully",
      paymentRef,
      subscription: {
        totalPayments: subscription.totalPayments,
        duePayments: subscription.duePayments,
        lastPaymentDate: subscription.lastPaymentDate
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Subscription Pay Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
