import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import User, { COMPANY_CATEGORY_MAP } from '@/models/User';
import Wallet from '@/models/Wallet';
import UserPricing from '@/models/UserPricing';
import connectDB from '@/lib/db';
import { regenerateUserPricing } from '@/lib/userPricing';

const INVALID_IMAGE_PLACEHOLDERS = new Set([
  'uploaded_file.png',
  'screenshot_secured.png'
]);

function isValidImageReference(value: unknown): boolean {
  if (typeof value !== 'string') return false;

  const normalized = value.trim();
  if (!normalized || INVALID_IMAGE_PLACEHOLDERS.has(normalized)) return false;

  return (
    normalized.startsWith('/uploads/kyc/') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('data:image/')
  );
}

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

    const kycData = user.toObject ? user.toObject().kyc : user.kyc;
    if (kycData && kycData.company !== undefined) {
      delete kycData.company;
    }

    return NextResponse.json({ kyc: kycData }, { status: 200 });
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

    if (rawBody.company !== undefined) {
      return NextResponse.json({ message: "Legacy 'company' field is deprecated. Use 'companies' array natively." }, { status: 400 });
    }

    if (rawBody.photo !== undefined && !isValidImageReference(rawBody.photo)) {
      return NextResponse.json({ message: 'Invalid profile photo reference' }, { status: 400 });
    }
    
    // Accept any subset of scalar KYC fields
    const requiredScalarFields = [
      'aadhaar', 'pan', 'photo', 'city', 'age', 
      'avgWeeklyIncome', 'avgWorkingHours'
    ];

    const optionalScalarFields = ['location', 'serviceZone', 'zone', 'population'];
    const configScalarFields = [...requiredScalarFields, ...optionalScalarFields];
    
    const updates: Record<string, any> = {};
    for (const field of configScalarFields) {
      if (rawBody[field] !== undefined) {
        updates[`kyc.${field}`] = rawBody[field];
      }
    }
    
    updates['kyc.updatedAt'] = new Date();
    
    const existingKyc = currentUser.kyc ? (currentUser.toObject ? currentUser.toObject().kyc : currentUser.kyc) : {};
    const existingCompanies = existingKyc.companies || [];
    let finalCompanies = [...existingCompanies];

    if (Array.isArray(rawBody.companies)) {
      const normalizedCompanies: any[] = [];

      for (const incoming of rawBody.companies) {
        if (!incoming.category || !incoming.company) {
          return NextResponse.json({ message: "Category and company are required for each company entry" }, { status: 400 });
        }
        
        const allowedComps = COMPANY_CATEGORY_MAP[incoming.category];
        if (!allowedComps || !allowedComps.includes(incoming.company)) {
          return NextResponse.json({ message: `Invalid company '${incoming.company}' for category '${incoming.category}'` }, { status: 400 });
        }

        if (
          incoming.dashboardScreenshot !== undefined &&
          incoming.dashboardScreenshot !== '' &&
          !isValidImageReference(incoming.dashboardScreenshot)
        ) {
          return NextResponse.json({ message: 'Invalid dashboard screenshot reference' }, { status: 400 });
        }
        
        const partnerId = incoming.partnerId || '';
        const dashboardScreenshot = incoming.dashboardScreenshot || '';
        const verified = !!(partnerId && dashboardScreenshot);

        // Prevent duplicates inside submitted array by company identifier.
        if (normalizedCompanies.some((c: any) => c.company === incoming.company)) {
          continue;
        }

        normalizedCompanies.push({
          category: incoming.category,
          company: incoming.company,
          partnerId,
          dashboardScreenshot,
          verified,
        });
      }

      finalCompanies = normalizedCompanies;
      updates['kyc.companies'] = normalizedCompanies;
    }
    
    if (finalCompanies.length > 0) {
      const firstCategory = finalCompanies[0].category;
      if (finalCompanies.some((c: any) => c.category !== firstCategory)) {
        return NextResponse.json({ message: "You can only add companies from a single category." }, { status: 400 });
      }
    }
    
    // Status Logic
    const hasVerifiedCompany = finalCompanies.some((c: any) => c.verified === true);
    const previousStatus = existingKyc.status || 'not_started';
    let newStatus = previousStatus;
    
    const finalKycState = { ...existingKyc };
    for (const field of configScalarFields) {
      if (updates[`kyc.${field}`] !== undefined) {
        finalKycState[field] = updates[`kyc.${field}`];
      }
    }
    
    const isProfileComplete = requiredScalarFields.every(field => {
      const val = finalKycState[field];
      return val !== undefined && val !== null && val !== '';
    });
    
    if (hasVerifiedCompany) {
      if (isProfileComplete) {
        newStatus = 'approved';
      } else {
        newStatus = 'pending';
      }
    } else {
      newStatus = 'partial';
    }
    
    updates['kyc.status'] = newStatus;
    
    await connectDB();
    
    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: currentUser._id }, { $set: updates });
    }
    
    // Auto-create wallet if status is pending or approved
    if (newStatus === 'pending' || newStatus === 'approved') {
      try {
        await Wallet.findOneAndUpdate(
          { userId: currentUser._id },
          { $setOnInsert: { userId: currentUser._id, balance: 300, transactions: [] } },
          { upsert: true, new: true }
        );
      } catch (err: any) {
        console.error("Failed to auto-create wallet:", err.message);
      }
    }

    // Assign Dynamic Pricing Document exactly once when user first reaches approved.
    if (newStatus === 'approved') {
      try {
        const existingPricing = await UserPricing.findOne({ userId: currentUser._id });
        const hasStoredPlans =
          !!existingPricing &&
          Array.isArray(existingPricing.plans) &&
          existingPricing.plans.length === 3;

        const shouldGeneratePricing = !hasStoredPlans;

        if (shouldGeneratePricing) {
          await regenerateUserPricing({
            userId: currentUser._id,
            city: finalKycState.city,
            avgWeeklyIncome: finalKycState.avgWeeklyIncome
          });
        }
      } catch (err: unknown) {
        const pricingErrorMessage = err instanceof Error ? err.message : String(err);
        console.error("Failed to setup user pricing:", pricingErrorMessage);
      }
    }
    
    return NextResponse.json({ 
      message: "KYC updated", 
      status: newStatus 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
