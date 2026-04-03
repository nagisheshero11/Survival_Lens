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
    subscription.lastPaymentDate = new Date();
    subscription.totalPayments += 1;
    subscription.duePayments = 0; // Reset dues after successful payment
    
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
