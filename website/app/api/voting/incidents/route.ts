import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { authenticateUser } from '@/middleware/auth';
import VotingIncident from '@/models/VotingIncident';

function normalizeCity(city: string): string {
  return city.trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const userCity = authResult.user.kyc?.city?.trim() || '';

    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(String(authResult.user._id));

    const incidents = await VotingIncident.find({
      status: 'open',
      windowEndAt: { $gte: new Date() },
      $or: [
        { targetUserIds: userObjectId },
        ...(userCity ? [{ targetCitiesNormalized: normalizeCity(userCity) }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const userId = String(authResult.user._id);

    const payload = incidents.map((incident) => ({
      id: String(incident._id),
      sourceCity: incident.sourceCity,
      riskLevel: incident.riskLevel,
      action: incident.action,
      safetyProbability: incident.safetyProbability,
      weather: incident.weather,
      targetCities: incident.targetCities,
      status: incident.status,
      votes: incident.votes,
      hasVoted: incident.voterIds.some((id) => String(id) === userId),
      windowStartAt: incident.windowStartAt,
      windowEndAt: incident.windowEndAt,
      createdAt: incident.createdAt,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('Fetch voting incidents error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
