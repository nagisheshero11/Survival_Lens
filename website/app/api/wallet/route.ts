import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Wallet from '@/models/Wallet';
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
    
    const wallet = await Wallet.findOne({ userId: currentUser._id });
    
    if (!wallet) {
      return NextResponse.json({ message: "Wallet not found for this user" }, { status: 404 });
    }

    // Sort transactions by createdAt descending for better UI presentation
    const sortedTransactions = [...wallet.transactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ 
      balance: wallet.balance, 
      transactions: sortedTransactions 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Wallet GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
