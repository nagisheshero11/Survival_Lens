import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Claim from '@/models/Claim';
import ClaimVoting from '@/models/ClaimVoting';
import connectDB from '@/lib/db';
import { getVotingWindow } from '@/lib/claimVoting';

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

    const { reason, amount } = rawBody;

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return NextResponse.json({ message: "Reason must not be empty" }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: "Amount must be a positive number" }, { status: 400 });
    }

    await connectDB();

    const votingCity = String(currentUser?.kyc?.city || '').trim();
    if (!votingCity) {
      return NextResponse.json(
        { message: "KYC city is required before creating a claim for community voting" },
        { status: 400 }
      );
    }

    const claim = await Claim.create({
      userId: currentUser._id,
      reason,
      amount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const { startTime, endTime } = getVotingWindow();
    await ClaimVoting.create({
      claimId: claim._id,
      city: votingCity,
      votes: [],
      startTime,
      endTime,
      status: 'active',
      result: { yesCount: 0, noCount: 0 },
    });

    return NextResponse.json({ 
      message: "Claim submitted", 
      status: "pending",
      claimId: claim._id.toString(),
      voting: {
        status: 'active',
        city: votingCity,
        startTime,
        endTime,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Claims POST Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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

    const claims = await Claim.find({ userId: currentUser._id })
      .sort({ createdAt: -1 })
      .select('_id reason amount status createdAt');

    const formattedClaims = claims.map((claim) => ({
      id: claim._id.toString(),
      reason: claim.reason,
      amount: claim.amount,
      status: claim.status,
      createdAt: claim.createdAt,
    }));

    return NextResponse.json(formattedClaims, { status: 200 });

  } catch (error: any) {
    console.error('Claims GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
