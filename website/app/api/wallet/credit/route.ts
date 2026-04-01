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

    const { amount, reason = "claim" } = rawBody;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: "Amount must be a positive number" }, { status: 400 });
    }

    if (!['claim'].includes(reason)) {
      // Per constraints, reason for credit from prompt usually default: "claim". We'll allow anything that passes enum, but typically "claim".
    }

    await connectDB();
    
    const paymentRef = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newTransaction = {
      type: 'credit',
      amount,
      reason,
      status: 'completed',
      paymentRef,
      createdAt: new Date()
    };

    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: currentUser._id },
      { 
        $inc: { balance: amount },
        $push: { transactions: newTransaction }
      },
      { new: true }
    );

    if (!updatedWallet) {
      return NextResponse.json({ message: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Wallet credited", 
      balance: updatedWallet.balance,
      paymentRef
    }, { status: 200 });

  } catch (error: any) {
    console.error('Wallet Credit Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
