import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import WeatherScanRun from '@/models/WeatherScanRun';
import VotingIncident from '@/models/VotingIncident';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    await connectDB();

    const [recentRuns, openIncidents, latestIncident] = await Promise.all([
      WeatherScanRun.find({}).sort({ startedAt: -1 }).limit(20).lean(),
      VotingIncident.countDocuments({ status: 'open', windowEndAt: { $gte: new Date() } }),
      VotingIncident.findOne({}).sort({ createdAt: -1 }).lean(),
    ]);

    const completedRuns = recentRuns.filter((run) => run.status === 'completed');
    const totalIncidents = completedRuns.reduce((sum, run) => sum + (run.createdIncidents || 0), 0);
    const totalNotifications = completedRuns.reduce((sum, run) => sum + (run.createdNotifications || 0), 0);

    return NextResponse.json(
      {
        summary: {
          openIncidents,
          completedRuns: completedRuns.length,
          totalIncidents,
          totalNotifications,
          latestIncidentAt: latestIncident?.createdAt || null,
        },
        runs: recentRuns.map((run) => ({
          id: String(run._id),
          startedAt: run.startedAt,
          finishedAt: run.finishedAt,
          status: run.status,
          reason: run.reason || null,
          scannedCities: run.scannedCities || [],
          createdIncidents: run.createdIncidents || 0,
          createdNotifications: run.createdNotifications || 0,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin voting monitor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
