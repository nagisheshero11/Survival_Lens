import { NextRequest, NextResponse } from 'next/server';
import Claim from '@/models/Claim';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (status) {
      query.status = status;
    }
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
      }
      query.userId = userId;
    }

    await connectDB();

    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedClaims = claims.map((claim: any) => ({
      id: claim._id.toString(),
      userId: claim.userId.toString(),
      reason: claim.reason,
      amount: claim.amount,
      status: claim.status,
      createdAt: claim.createdAt.toISOString().split('T')[0] // formatting to YYYY-MM-DD per example
    }));

    return NextResponse.json(formattedClaims, { status: 200 });
  } catch (error) {
    console.error('Fetch claims error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
