import { NextRequest, NextResponse } from 'next/server';
import { getDailyActivityModel } from '@/models/DailyActivity';
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

    // Determine today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const DailyActivity = await getDailyActivityModel();

    // Query finding user document today
    const activity = await DailyActivity.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    }).lean();
    
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found for today' }, { status: 404 });
    }

    const response = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      date: (activity as any).date.toISOString().split('T')[0],
      hoursWorked: activity.hoursWorked || 0,
      ordersCompleted: activity.ordersCompleted || 0,
      totalEarnings: activity.totalEarnings || 0,
      weather: activity.weather || 'clear'
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch today activity error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
