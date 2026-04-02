import { NextRequest, NextResponse } from 'next/server';
import User, { COMPANY_CATEGORY_MAP } from '@/models/User';
import connectDB from '@/lib/db';
import { authenticateAdmin } from '@/middleware/auth';
import mongoose from 'mongoose';

function getCategoryForCompany(companyName: string): string | undefined {
  for (const [category, companies] of Object.entries(COMPANY_CATEGORY_MAP)) {
    if (companies.some(c => c.toLowerCase() === companyName.toLowerCase())) {
      return category;
    }
  }
  return undefined;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      company: user.kyc?.companies?.[0]?.company || '',
      city: user.kyc?.city || '',
      kyc: {
        status: user.kyc?.status || 'not_started'
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch user detail error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const { fullName, mobile, city, company } = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (fullName) updateData['fullName'] = fullName;
    if (mobile) updateData['mobile'] = mobile;
    if (city) updateData['kyc.city'] = city;
    
    if (company) {
      const category = getCategoryForCompany(company);
      if (!category) {
        return NextResponse.json({ error: `Invalid company: ${company}` }, { status: 400 });
      }

      // To handle proper casing found in the config
      const properCompanyName = COMPANY_CATEGORY_MAP[category].find(c => c.toLowerCase() === company.toLowerCase()) || company;

      updateData['kyc.companies.0.company'] = properCompanyName;
      updateData['kyc.companies.0.category'] = category;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided for update' }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated' }, { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
