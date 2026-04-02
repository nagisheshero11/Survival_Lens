import { NextRequest, NextResponse } from 'next/server';
import { getWorkerProfileModel } from '@/models/WorkerProfile';
import { authenticateAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const WorkerProfile = await getWorkerProfileModel();

    const profile = await WorkerProfile.findOne({ userId }).lean();
    
    if (!profile) {
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
    }

    const response = {
      company: profile.company || '',
      city: profile.city || '',
      zone: profile.zone || '',
      workingHoursPerDay: profile.workingHoursPerDay || 0,
      avgOrdersPerDay: profile.avgOrdersPerDay || 0,
      avgDailyIncome: profile.avgDailyIncome || 0,
      rating: profile.rating || 0
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch worker profile error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
