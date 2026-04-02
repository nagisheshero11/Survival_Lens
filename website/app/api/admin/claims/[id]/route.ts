import { NextRequest, NextResponse } from 'next/server';
import Claim from '@/models/Claim';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid claimId' }, { status: 400 });
    }

    await connectDB();

    const claim = await Claim.findById(id).lean();
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    const response = {
      id: claim._id.toString(),
      userId: claim.userId.toString(),
      reason: claim.reason,
      amount: claim.amount,
      status: claim.status,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createdAt: (claim as any).createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch claim detail error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
