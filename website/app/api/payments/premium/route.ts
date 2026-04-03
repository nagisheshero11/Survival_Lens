import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Wallet from '@/models/Wallet';
import Payment from '@/models/Payment';
import connectDB from '@/lib/db';
import { logAdminTransaction } from '@/lib/adminWalletUtils';

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
    
    // Explicit format txn_timestamp requested by user schema guidelines
    const paymentRef = `txn_${Date.now()}`;

    const newTransaction = {
      type: 'debit',
      amount,
      reason: 'premium',
      status: 'completed',
      paymentRef,
      createdAt: new Date()
    };

    // Use $gte condition in the query to guarantee atomic check and update simultaneously
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

    // Only executed once Wallet natively updates without negative bounding errors array/ledger successfully
    await Payment.create({
      userId: currentUser._id,
      amount,
      type: 'premium',
      method: 'wallet',
      status: 'success',
      paymentRef,
      createdAt: new Date()
    });

    try {
      await logAdminTransaction({
        type: 'credit',
        amount,
        source: 'premium',
        userId: currentUser._id.toString(),
        userName: currentUser.fullName || 'Unknown',
        referenceId: paymentRef
      });
    } catch (adminErr) {
      console.error('Failed to log admin premium transaction:', adminErr);
      // We continue since the user side is successful, but ideally we'd halt or retry.
    }

    return NextResponse.json({ 
      message: "Premium paid successfully", 
      paymentRef,
      balance: updatedWallet.balance
    }, { status: 200 });

  } catch (error: any) {
    console.error('Payments Premium Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
