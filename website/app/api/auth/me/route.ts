import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // 1. Use JWT middleware & 2. Get user
    const authResult = await authenticateUser(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const user = authResult.user!;

    // 4. Return user details
    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        kyc: user.kyc
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Me API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
