import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { authenticateUser } from '@/middleware/auth';
import UserNotification from '@/models/UserNotification';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    await connectDB();

    const limit = Number(request.nextUrl.searchParams.get('limit') || 15);
    const safeLimit = Number.isNaN(limit) ? 15 : Math.min(Math.max(limit, 1), 50);

    const userId = authResult.user._id;

    const [notifications, unreadCount] = await Promise.all([
      UserNotification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(safeLimit)
        .lean(),
      UserNotification.countDocuments({ userId, read: false }),
    ]);

    return NextResponse.json(
      {
        unreadCount,
        notifications: notifications.map((item) => ({
          id: String(item._id),
          title: item.title,
          message: item.message,
          type: item.type,
          incidentId: item.incidentId ? String(item.incidentId) : null,
          read: item.read,
          createdAt: item.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
