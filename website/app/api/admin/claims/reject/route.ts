import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Claim from '@/models/Claim';
import connectDB from '@/lib/db';

const ADMIN_EMAILS = ['admin@survivallens.com'];

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Basic admin check safely bypassing existing DB structures
    if (!ADMIN_EMAILS.includes(currentUser.email)) {
      return NextResponse.json({ message: "Unauthorized access: Admin only" }, { status: 403 });
    }

    let rawBody;
    try {
      rawBody = await request.json();
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { claimId } = rawBody;

    if (!claimId) {
      return NextResponse.json({ message: "claimId is required" }, { status: 400 });
    }

    await connectDB();

    const claim = await Claim.findById(claimId);
    
    if (!claim) {
      return NextResponse.json({ message: "Claim not found" }, { status: 404 });
    }

    if (claim.status === 'approved' || claim.status === 'rejected') {
      return NextResponse.json({ message: `Claim is already ${claim.status}` }, { status: 400 });
    }

    claim.status = 'rejected';
    claim.updatedAt = new Date();
    
    await claim.save();

    return NextResponse.json({ message: "Claim rejected" }, { status: 200 });

  } catch (error: any) {
    console.error('Admin Claims Reject Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
