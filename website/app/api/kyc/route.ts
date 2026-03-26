import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import User, { COMPANY_CATEGORY_MAP } from '@/models/User';
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
    
    // Accept any subset of scalar KYC fields
    const configScalarFields = [
      'aadhaar', 'pan', 'photo', 'city', 'age', 
      'avgWeeklyIncome', 'avgWorkingHours'
    ];
    
    const updates: Record<string, any> = {};
    for (const field of configScalarFields) {
      if (rawBody[field] !== undefined) {
        updates[`kyc.${field}`] = rawBody[field];
      }
    }
    
    updates['kyc.updatedAt'] = new Date();
    
    const existingKyc = currentUser.kyc ? (currentUser.toObject ? currentUser.toObject().kyc : currentUser.kyc) : {};
    const existingCompanies = existingKyc.companies || [];
    const finalCompanies = [...existingCompanies];
    
    const pushOperations: any[] = [];
    
    if (rawBody.companies && Array.isArray(rawBody.companies)) {
      for (const incoming of rawBody.companies) {
        if (!incoming.category || !incoming.company) {
          return NextResponse.json({ message: "Category and company are required for each company entry" }, { status: 400 });
        }
        
        const allowedComps = COMPANY_CATEGORY_MAP[incoming.category];
        if (!allowedComps || !allowedComps.includes(incoming.company)) {
          return NextResponse.json({ message: `Invalid company '${incoming.company}' for category '${incoming.category}'` }, { status: 400 });
        }
        
        const existingIndex = existingCompanies.findIndex((c: any) => c.company === incoming.company);
        
        let verified = false;
        
        if (existingIndex !== -1) {
          // Update existing target in final array
          const existing = existingCompanies[existingIndex];
          const partnerId = incoming.partnerId !== undefined ? incoming.partnerId : existing.partnerId;
          const dashboardScreenshot = incoming.dashboardScreenshot !== undefined ? incoming.dashboardScreenshot : existing.dashboardScreenshot;
          
          verified = !!(partnerId && dashboardScreenshot);
          
          if (incoming.category !== undefined) updates[`kyc.companies.${existingIndex}.category`] = incoming.category;
          if (incoming.partnerId !== undefined) updates[`kyc.companies.${existingIndex}.partnerId`] = incoming.partnerId;
          if (incoming.dashboardScreenshot !== undefined) updates[`kyc.companies.${existingIndex}.dashboardScreenshot`] = incoming.dashboardScreenshot;
          updates[`kyc.companies.${existingIndex}.verified`] = verified;
          
          finalCompanies[existingIndex] = { ...existing, ...incoming, verified, partnerId, dashboardScreenshot };
        } else {
          // Prevent duplicates natively inside the incoming array
          const finalIndex = finalCompanies.findIndex((c: any) => c.company === incoming.company);
          if (finalIndex !== -1) continue;
          
          verified = !!(incoming.partnerId && incoming.dashboardScreenshot);
          const newCompany = {
            category: incoming.category,
            company: incoming.company,
            partnerId: incoming.partnerId || '',
            dashboardScreenshot: incoming.dashboardScreenshot || '',
            verified
          };
          pushOperations.push(newCompany);
          finalCompanies.push(newCompany);
        }
      }
    }
    
    if (finalCompanies.length > 0) {
      const firstCategory = finalCompanies[0].category;
      if (finalCompanies.some((c: any) => c.category !== firstCategory)) {
        return NextResponse.json({ message: "You can only add companies from a single category." }, { status: 400 });
      }
    }
    
    // Status Logic
    const hasVerifiedCompany = finalCompanies.some((c: any) => c.verified === true);
    let newStatus = existingKyc.status || 'not_started';
    
    if (hasVerifiedCompany) {
      newStatus = 'pending';
    } else {
      newStatus = 'partial';
    }
    
    updates['kyc.status'] = newStatus;
    
    await connectDB();
    
    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: currentUser._id }, { $set: updates });
    }
    
    if (pushOperations.length > 0) {
      await User.updateOne({ _id: currentUser._id }, { $push: { 'kyc.companies': { $each: pushOperations } } });
    }
    
    return NextResponse.json({ 
      message: "KYC updated", 
      status: newStatus 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
