import { NextRequest, NextResponse } from 'next/server';
import { getDailyActivityModel } from '@/models/DailyActivity';
import { authenticateAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!from || !to) {
      return NextResponse.json({ error: 'from and to dates are required' }, { status: 400 });
    }

    const fromDate = new Date(from);
    if (isNaN(fromDate.getTime())) {
      return NextResponse.json({ error: 'Invalid config: from date' }, { status: 400 });
    }

    const toDate = new Date(to);
    if (isNaN(toDate.getTime())) {
      return NextResponse.json({ error: 'Invalid config: to date' }, { status: 400 });
    }

    if (fromDate > toDate) {
      return NextResponse.json({ error: 'from date must be before or equal to to date' }, { status: 400 });
    }

    // To ensure entire "to" day is captured, extend its end boundary to 23:59:59
    const toDateBoundary = new Date(toDate);
    toDateBoundary.setHours(23, 59, 59, 999);

    const DailyActivity = await getDailyActivityModel();

    const activities = await DailyActivity.find({
      userId,
      date: { $gte: fromDate, $lte: toDateBoundary }
    })
      .sort({ date: 1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedResponse = activities.map((activity: any) => ({
      date: activity.date.toISOString().split('T')[0],
      ordersCompleted: activity.ordersCompleted || 0,
      totalEarnings: activity.totalEarnings || 0
    }));

    return NextResponse.json(formattedResponse, { status: 200 });

  } catch (error) {
    console.error('Fetch activity range error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
