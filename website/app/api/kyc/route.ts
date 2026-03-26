import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const user = authResult.user;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ kyc: user.kyc }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

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

    let rawBody;
    try {
      rawBody = await request.json();
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }
    
    // Accept any subset of KYC fields
    const allowedFields = [
      'aadhaar', 'pan', 'photo', 'city', 'age', 
      'company', 'partnerId', 'dashboardScreenshot', 
      'avgWeeklyIncome', 'avgWorkingHours'
    ];
    
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (rawBody[field] !== undefined) {
        updates[`kyc.${field}`] = rawBody[field];
      }
    }
    
    // Add updatedAt
    updates['kyc.updatedAt'] = new Date();
    
    // Get the merged KYC object to evaluate status accurately
    // The previous fields are preserved in currentUser.toObject() if available
    const existingKyc = currentUser.kyc ? (currentUser.toObject ? currentUser.toObject().kyc : currentUser.kyc) : {};
    const mergedKyc = { ...existingKyc, ...rawBody };
    
    // Logic for status: Determine how many "important" fields are present
    const requiredFieldsForPending = [
      'aadhaar', 'pan', 'photo', 'city', 'company', 
      'partnerId', 'dashboardScreenshot'
    ];
    
    let filledRequiredCount = 0;
    for (const field of requiredFieldsForPending) {
      // Check if truthy and not an empty string
      if (mergedKyc[field] && String(mergedKyc[field]).trim() !== '') {
        filledRequiredCount++;
      }
    }
    
    let newStatus = existingKyc.status || 'not_started';
    
    // If it's already approved or rejected, we might want to change it to pending again if they update it, 
    // or keep it. The user said: "If most required fields present -> "pending"".
    // We will set status based explicitly on the count.
    if (filledRequiredCount >= 5) {
      newStatus = 'pending';
    } else if (filledRequiredCount > 0) {
      newStatus = 'partial';
    } else {
      newStatus = 'not_started';
    }
    
    updates['kyc.status'] = newStatus;
    
    await connectDB();
    
    // Ensure the operation uses $set to update only provided fields in DB
    await User.updateOne(
      { _id: currentUser._id },
      { $set: updates }
    );
    
    return NextResponse.json({ 
      message: "KYC updated", 
      status: newStatus 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
