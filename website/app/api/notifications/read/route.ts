import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { authenticateUser } from '@/middleware/auth';
import UserNotification from '@/models/UserNotification';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    await connectDB();

    const body = await request.json().catch(() => ({}));
    const id = body?.id as string | undefined;

    if (id) {
      await UserNotification.updateOne(
        { _id: id, userId: authResult.user._id },
        { $set: { read: true } }
      );
    } else {
      await UserNotification.updateMany(
        { userId: authResult.user._id, read: false },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({ message: 'Notifications marked as read' }, { status: 200 });
  } catch (error) {
    console.error('Notifications read error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
