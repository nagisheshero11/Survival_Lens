import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Wallet from '@/models/Wallet';
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
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { amount } = rawBody;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: "Amount must be a positive number" }, { status: 400 });
    }

    await connectDB();
    
    const paymentRef = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newTransaction = {
      type: 'debit',
      amount,
      reason: 'withdraw',
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
      // It's either insufficient balance or wallet not found. Let's distinguish.
      const walletExists = await Wallet.findOne({ userId: currentUser._id });
      if (!walletExists) {
        return NextResponse.json({ message: "Wallet not found" }, { status: 404 });
      } else {
        return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      message: "Withdrawal successful", 
      balance: updatedWallet.balance,
      paymentRef
    }, { status: 200 });

  } catch (error: any) {
    console.error('Wallet Withdraw Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
