import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { authenticateUser } from '@/middleware/auth';
import VotingIncident from '@/models/VotingIncident';

function normalizeCity(city: string): string {
  return city.trim().toLowerCase();
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid incident id' }, { status: 400 });
    }

    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(String(authResult.user._id));
    const userCity = authResult.user.kyc?.city?.trim();
    const normalizedCity = userCity ? normalizeCity(userCity) : null;

    const incident = await VotingIncident.findOneAndUpdate(
      {
        _id: id,
        status: 'open',
        voterIds: { $ne: userObjectId },
        windowEndAt: { $gte: new Date() },
        $or: [
          { targetUserIds: userObjectId },
          ...(normalizedCity ? [{ targetCitiesNormalized: normalizedCity }] : []),
        ],
      },
      {
        $addToSet: { voterIds: userObjectId },
        $inc: { votes: 1 },
      },
      { new: true }
    );

    if (!incident) {
      return NextResponse.json(
        { message: 'Incident not found, closed, or already voted' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: 'Vote recorded',
        id: String(incident._id),
        votes: incident.votes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vote submission error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
