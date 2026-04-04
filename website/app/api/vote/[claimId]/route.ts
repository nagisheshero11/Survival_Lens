import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { authenticateUser } from '@/middleware/auth';
import connectDB from '@/lib/db';
import ClaimVoting from '@/models/ClaimVoting';
import { closeVotingIfExpired } from '@/lib/claimVoting';

export async function GET(request: NextRequest, context: { params: Promise<{ claimId: string }> }) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { claimId } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      return NextResponse.json({ message: 'Invalid claimId' }, { status: 400 });
    }

    await connectDB();

    const voting = await ClaimVoting.findOne({ claimId });
    if (!voting) {
      return NextResponse.json({ message: 'Voting not found for claim' }, { status: 404 });
    }

    await closeVotingIfExpired(voting);

    const yesCount = voting.votes.filter((entry) => entry.vote === 'yes').length;
    const noCount = voting.votes.filter((entry) => entry.vote === 'no').length;

    const voterCity = String(currentUser?.kyc?.city || '').trim().toLowerCase();
    const targetCity = String(voting.city || '').trim().toLowerCase();

    const myVoteEntry = voting.votes.find((entry) => entry.userId.toString() === currentUser._id.toString());
    const hasVoted = !!myVoteEntry;
    const canVote =
      voting.status === 'active' &&
      new Date().getTime() < voting.endTime.getTime() &&
      voterCity &&
      targetCity &&
      voterCity === targetCity &&
      !hasVoted;

    return NextResponse.json(
      {
        status: voting.status,
        yesCount,
        noCount,
        endTime: voting.endTime,
        startTime: voting.startTime,
        city: voting.city,
        canVote,
        hasVoted,
        myVote: myVoteEntry?.vote || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vote GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
