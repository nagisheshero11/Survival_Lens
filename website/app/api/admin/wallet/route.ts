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
      // Wallet hasn't been created yet, return defaults
      return NextResponse.json({
        balance: 0,
        transactions: []
      }, { status: 200 });
    }

    // Limit transactions to the last 50 for this overview endpoint
    const recentTransactions = adminWallet.transactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 50);

    return NextResponse.json({
      balance: adminWallet.balance,
      transactions: recentTransactions
    }, { status: 200 });

  } catch (error) {
    console.error('Admin Wallet GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
