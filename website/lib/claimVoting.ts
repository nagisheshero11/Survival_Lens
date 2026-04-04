import mongoose from 'mongoose';
import ClaimVoting, { IClaimVoting } from '@/models/ClaimVoting';

export function getVotingDurationMs(): number {
  const minutes = Number(process.env.VOTING_DURATION_MINUTES || '2');
  const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 2;
  return safeMinutes * 60 * 1000;
}

export function getVotingWindow(now: Date = new Date()): { startTime: Date; endTime: Date } {
  const startTime = now;
  const endTime = new Date(now.getTime() + getVotingDurationMs());
  return { startTime, endTime };
}

export function countVotes(votes: Array<{ vote: 'yes' | 'no' }>): { yesCount: number; noCount: number } {
  let yesCount = 0;
  let noCount = 0;

  votes.forEach((entry) => {
    if (entry.vote === 'yes') yesCount += 1;
    if (entry.vote === 'no') noCount += 1;
  });

  return { yesCount, noCount };
}

export async function closeVotingIfExpired(voting: IClaimVoting, now: Date = new Date()): Promise<IClaimVoting> {
  if (voting.status === 'closed') {
    return voting;
  }

  if (now.getTime() < voting.endTime.getTime()) {
    return voting;
  }

  const result = countVotes(voting.votes);
  voting.status = 'closed';
  voting.result = result;
  await voting.save();
  return voting;
}

export async function loadVotingWithAutoClose(claimId: string, now: Date = new Date()): Promise<IClaimVoting | null> {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    return null;
  }

  const voting = await ClaimVoting.findOne({ claimId });
  if (!voting) return null;
  return closeVotingIfExpired(voting, now);
}
