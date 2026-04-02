import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = request.nextUrl;
    const company = searchParams.get('company');
    const city = searchParams.get('city');
    const kycStatus = searchParams.get('kycStatus');

    // Build query dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (company) {
      query['kyc.companies.company'] = { $regex: new RegExp(`^${company}$`, 'i') };
    }
    if (city) {
      query['kyc.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    }
    if (kycStatus) {
      query['kyc.status'] = kycStatus;
    }

    await connectDB();

    const users = await User.find(query).select('_id fullName email kyc.companies kyc.city kyc.status').lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      fullName: user.fullName || '',
      email: user.email || '',
      company: user.kyc?.companies?.[0]?.company || '',
      city: user.kyc?.city || '',
      kycStatus: user.kyc?.status || 'not_started'
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
