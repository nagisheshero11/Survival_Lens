import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import AdminWallet from '@/models/AdminWallet';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    await connectDB();

    const adminWallet = await AdminWallet.findOne({});
    
    if (!adminWallet) {
      return NextResponse.json({ transactions: [] }, { status: 200 });
    }

    // Return the full list of transactions, sorted latest first
    // Since it's an embedded array, we do sorting in JS. 
    // In production with huge arrays, transactions should ideally be a separate collection,
    // but schema constraints require them to be embedded in AdminWallet.
    const allTransactions = adminWallet.transactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({
      transactions: allTransactions
    }, { status: 200 });

  } catch (error) {
    console.error('Admin Wallet Transactions GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
