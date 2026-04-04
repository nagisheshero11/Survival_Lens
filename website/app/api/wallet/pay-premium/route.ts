import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Wallet from '@/models/Wallet';
import UserPricing from '@/models/UserPricing';
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

    let rawBody = {};
    try {
      rawBody = await request.json();
    } catch (_e) {
      // Empty body is expected for strict plan-based premium payment.
    }

    if (rawBody && typeof rawBody === 'object' && 'amount' in rawBody) {
      return NextResponse.json({ message: 'Manual amount is not allowed for premium payment.' }, { status: 400 });
    }

    await connectDB();

    const userPricing = await UserPricing.findOne({ userId: currentUser._id });
    const selectedPlan = userPricing?.selectedPlan;
    if (!selectedPlan || typeof selectedPlan.price !== 'number' || selectedPlan.price <= 0) {
      return NextResponse.json({ message: 'No valid selected plan found. Select a plan before payment.' }, { status: 400 });
    }

    const amount = selectedPlan.price;
    
    const paymentRef = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newTransaction = {
      type: 'debit',
      amount,
      reason: 'premium',
      status: 'completed',
      paymentRef,
      createdAt: new Date()
    };

    // Use $gte condition in the query to guarantee atomic check and update
    const updatedWallet = await Wallet.findOneAndUpdate(
      { 
        userId: currentUser._id,
        balance: { $gte: amount }
      },
      { 
        $inc: { balance: -amount },
        $push: { transactions: newTransaction }
      },
      { new: true }
    );

    if (!updatedWallet) {
      const walletExists = await Wallet.findOne({ userId: currentUser._id });
      if (!walletExists) {
        return NextResponse.json({ message: "Wallet not found" }, { status: 404 });
      } else {
        return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      message: "Premium paid", 
      balance: updatedWallet.balance,
      paymentRef
    }, { status: 200 });

  } catch (error: any) {
    console.error('Wallet Pay-Premium Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
