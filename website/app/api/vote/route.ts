import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { authenticateUser } from '@/middleware/auth';
import ClaimVoting from '@/models/ClaimVoting';
import Claim from '@/models/Claim';
import connectDB from '@/lib/db';
import { closeVotingIfExpired } from '@/lib/claimVoting';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const voterCityRaw = String(currentUser?.kyc?.city || '').trim();
    if (!voterCityRaw) {
      return NextResponse.json({ message: 'KYC city is required to access claim voting' }, { status: 400 });
    }

    await connectDB();

    const cityRegex = new RegExp(`^${voterCityRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const votings = await ClaimVoting.find({ city: cityRegex }).sort({ createdAt: -1 });

    if (!votings.length) {
      return NextResponse.json([], { status: 200 });
    }

    const now = new Date();
    for (const voting of votings) {
      await closeVotingIfExpired(voting, now);
    }

    const claimIds = votings.map((voting) => voting.claimId);
    const claims = await Claim.find({ _id: { $in: claimIds } }).select('_id reason amount status createdAt userId').lean();
    const claimMap = new Map(claims.map((claim) => [claim._id.toString(), claim]));

    const payload = votings
      .map((voting) => {
        const claim = claimMap.get(voting.claimId.toString());
        if (!claim) return null;

        const yesCount = voting.votes.filter((entry) => entry.vote === 'yes').length;
        const noCount = voting.votes.filter((entry) => entry.vote === 'no').length;
        const myVoteEntry = voting.votes.find((entry) => entry.userId.toString() === currentUser._id.toString());
        const hasVoted = !!myVoteEntry;
        const canVote =
          voting.status === 'active' &&
          now.getTime() < voting.endTime.getTime() &&
          !hasVoted;

        return {
          claimId: claim._id.toString(),
          reason: claim.reason,
          amount: claim.amount,
          claimStatus: claim.status,
          claimCreatedAt: claim.createdAt,
          votingCity: voting.city,
          votingStatus: voting.status,
          startTime: voting.startTime,
          endTime: voting.endTime,
          yesCount,
          noCount,
          canVote,
          hasVoted,
          myVote: myVoteEntry?.vote || null,
        };
      })
      .filter(Boolean);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('Vote GET List Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let rawBody: { claimId?: string; vote?: string };
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
    }

    const claimId = String(rawBody.claimId || '').trim();
    const vote = String(rawBody.vote || '').trim().toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      return NextResponse.json({ message: 'Invalid claimId' }, { status: 400 });
    }

    if (vote !== 'yes' && vote !== 'no') {
      return NextResponse.json({ message: "Vote must be either 'yes' or 'no'" }, { status: 400 });
    }

    await connectDB();

    const voting = await ClaimVoting.findOne({ claimId });
    if (!voting) {
      return NextResponse.json({ message: 'Voting not found for claim' }, { status: 404 });
    }

    await closeVotingIfExpired(voting);

    if (voting.status !== 'active') {
      return NextResponse.json({ message: 'Voting is closed' }, { status: 400 });
    }

    if (new Date().getTime() >= voting.endTime.getTime()) {
      await closeVotingIfExpired(voting);
      return NextResponse.json({ message: 'Voting is closed' }, { status: 400 });
    }

    const voterCity = String(currentUser?.kyc?.city || '').trim().toLowerCase();
    const targetCity = String(voting.city || '').trim().toLowerCase();

    if (!voterCity || !targetCity || voterCity !== targetCity) {
      return NextResponse.json({ message: 'Only users from the same city can vote' }, { status: 403 });
    }

    const updateResult = await ClaimVoting.updateOne(
      {
        _id: voting._id,
        status: 'active',
        endTime: { $gt: new Date() },
        'votes.userId': { $ne: currentUser._id },
      },
      {
        $push: {
          votes: {
            userId: currentUser._id,
            vote,
            createdAt: new Date(),
          },
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      const refreshed = await ClaimVoting.findById(voting._id);
      if (!refreshed) {
        return NextResponse.json({ message: 'Voting not found' }, { status: 404 });
      }

      await closeVotingIfExpired(refreshed);

      const alreadyVoted = refreshed.votes.some((entry) => entry.userId.toString() === currentUser._id.toString());
      if (alreadyVoted) {
        return NextResponse.json({ message: 'You have already voted' }, { status: 409 });
      }

      if (refreshed.status !== 'active') {
        return NextResponse.json({ message: 'Voting is closed' }, { status: 400 });
      }

      return NextResponse.json({ message: 'Failed to submit vote' }, { status: 400 });
    }

    const updatedVoting = await ClaimVoting.findById(voting._id);
    if (!updatedVoting) {
      return NextResponse.json({ message: 'Voting not found after update' }, { status: 404 });
    }

    const yesCount = updatedVoting.votes.filter((entry) => entry.vote === 'yes').length;
    const noCount = updatedVoting.votes.filter((entry) => entry.vote === 'no').length;

    return NextResponse.json(
      {
        message: 'Vote submitted',
        status: updatedVoting.status,
        yesCount,
        noCount,
        endTime: updatedVoting.endTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vote POST Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
