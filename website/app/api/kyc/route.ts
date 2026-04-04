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

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
const DEFAULT_PHOTO_MIME = 'image/jpeg';

function normalizePhotoBuffer(value: unknown): Buffer | null {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === 'object' && value !== null) {
    const maybeBuffer = value as { type?: string; data?: unknown; buffer?: unknown };
    if (maybeBuffer.type === 'Buffer' && Array.isArray(maybeBuffer.data)) {
      return Buffer.from(maybeBuffer.data);
    }
    if (maybeBuffer.buffer instanceof Uint8Array) {
      return Buffer.from(maybeBuffer.buffer);
    }
  }
  return null;
}

function serializePhoto(photo: unknown, photoMimeType: unknown): string {
  const mimeType =
    typeof photoMimeType === 'string' && photoMimeType.trim()
      ? photoMimeType.trim()
      : DEFAULT_PHOTO_MIME;

  const photoBuffer = normalizePhotoBuffer(photo);
  if (photoBuffer && photoBuffer.length > 0) {
    return `data:${mimeType};base64,${photoBuffer.toString('base64')}`;
  }

  if (typeof photo === 'string') {
    return photo.trim();
  }

  return '';
}

function serializeKyc(kyc: unknown) {
  if (!kyc || typeof kyc !== 'object') return kyc;

  const source = kyc as Record<string, unknown>;
  const serialized = { ...source } as Record<string, unknown>;
  serialized.photo = serializePhoto(source.photo, source.photoMimeType);
  if (serialized.company !== undefined) {
    delete serialized.company;
  }
  return serialized;
}

function parsePhotoDataUrl(value: string): { buffer: Buffer; mimeType: string } | null {
  const trimmed = value.trim();
  const match = /^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(trimmed);
  if (!match) return null;

  const mimeType = match[1].toLowerCase();
  if (!ALLOWED_PHOTO_TYPES.has(mimeType)) return null;

  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > MAX_PHOTO_BYTES) return null;

  return { buffer, mimeType };
}

async function parseRequestBody(request: NextRequest): Promise<{
  rawBody: Record<string, any>;
  photoUpdate: { buffer: Buffer; mimeType: string } | null;
  shouldClearPhoto: boolean;
}> {
  const contentType = request.headers.get('content-type') || '';
  let photoUpdate: { buffer: Buffer; mimeType: string } | null = null;
  let shouldClearPhoto = false;

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const rawBody: Record<string, any> = {};

    const scalarFields = [
      'aadhaar',
      'pan',
      'city',
      'age',
      'avgWeeklyIncome',
      'avgWorkingHours',
      'location',
      'serviceZone',
      'zone',
      'population',
    ];

    for (const field of scalarFields) {
      const value = formData.get(field);
      if (typeof value === 'string') {
        rawBody[field] = value;
      }
    }

    const companiesValue = formData.get('companies');
    if (typeof companiesValue === 'string' && companiesValue.trim()) {
      try {
        rawBody.companies = JSON.parse(companiesValue);
      } catch {
        throw new Error('Invalid companies payload');
      }
    }

    const photoFile = formData.get('photo');
    if (photoFile instanceof File) {
      if (!ALLOWED_PHOTO_TYPES.has(photoFile.type)) {
        throw new Error('Unsupported profile photo format. Use JPG, PNG, or WEBP.');
      }
      if (photoFile.size <= 0 || photoFile.size > MAX_PHOTO_BYTES) {
        throw new Error('Invalid profile photo size. Max size is 5MB.');
      }

      const bytes = await photoFile.arrayBuffer();
      photoUpdate = { buffer: Buffer.from(bytes), mimeType: photoFile.type.toLowerCase() };
    }

    const photoDataUrlValue = formData.get('photoDataUrl');
    if (!photoUpdate && typeof photoDataUrlValue === 'string' && photoDataUrlValue.trim()) {
      const parsed = parsePhotoDataUrl(photoDataUrlValue);
      if (!parsed) {
        throw new Error('Invalid profile photo payload');
      }
      photoUpdate = parsed;
    }

    const clearPhotoValue = formData.get('clearPhoto');
    if (
      typeof clearPhotoValue === 'string' &&
      (clearPhotoValue === '1' || clearPhotoValue.toLowerCase() === 'true')
    ) {
      shouldClearPhoto = true;
    }

    return { rawBody, photoUpdate, shouldClearPhoto };
  }

  let rawBody: Record<string, any>;
  try {
    rawBody = await request.json();
  } catch {
    throw new Error('Invalid JSON format');
  }

  if (typeof rawBody.photo === 'string') {
    const trimmed = rawBody.photo.trim();
    if (!trimmed) {
      shouldClearPhoto = true;
    } else {
      const parsed = parsePhotoDataUrl(trimmed);
      if (!parsed) {
        throw new Error('Invalid profile photo payload');
      }
      photoUpdate = parsed;
    }
  }

  return { rawBody, photoUpdate, shouldClearPhoto };
}

function isValidImageReference(value: unknown): boolean {
  if (typeof value !== 'string') return false;

  const normalized = value.trim();
  if (!normalized) return false;

  const normalizedWithoutQuery = normalized.split('?')[0]?.trim() || '';
  if (INVALID_IMAGE_PLACEHOLDERS.has(normalizedWithoutQuery)) return false;

  return (
    normalized.startsWith('/uploads/kyc/') ||
    normalized.startsWith('uploads/kyc/') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('data:image/')
  );
}

function normalizeImageReference(value: unknown): string {
  if (typeof value !== 'string') return '';

  const normalized = value.trim();
  if (!normalized || !isValidImageReference(normalized)) return '';

  if (normalized.startsWith('uploads/kyc/')) {
    return `/${normalized}`;
  }

  return normalized;
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

    return NextResponse.json({ kyc: serializeKyc(kycData) }, { status: 200 });
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

    let rawBody: Record<string, any>;
    let photoUpdate: { buffer: Buffer; mimeType: string } | null = null;
    let shouldClearPhoto = false;
    try {
      const parsedBody = await parseRequestBody(request);
      rawBody = parsedBody.rawBody;
      photoUpdate = parsedBody.photoUpdate;
      shouldClearPhoto = parsedBody.shouldClearPhoto;
    } catch (e: any) {
      return NextResponse.json({ message: e?.message || 'Invalid request payload' }, { status: 400 });
    }

    if (rawBody.company !== undefined) {
      return NextResponse.json({ message: "Legacy 'company' field is deprecated. Use 'companies' array natively." }, { status: 400 });
    }
    
    // Accept any subset of scalar KYC fields
    const requiredScalarFields = [
      'aadhaar', 'pan', 'city', 'age', 
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
    const existingPhotoBuffer = normalizePhotoBuffer(existingKyc.photo);
    const hadExistingPhoto =
      (existingPhotoBuffer && existingPhotoBuffer.length > 0) ||
      (typeof existingKyc.photo === 'string' && existingKyc.photo.trim().length > 0);

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

        const dashboardScreenshot = normalizeImageReference(incoming.dashboardScreenshot);
        const partnerId = incoming.partnerId || '';
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

    if (photoUpdate) {
      updates['kyc.photo'] = photoUpdate.buffer;
      updates['kyc.photoMimeType'] = photoUpdate.mimeType;
    } else if (shouldClearPhoto) {
      updates['kyc.photo'] = null;
      updates['kyc.photoMimeType'] = '';
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

    const hasPhotoInFinalState =
      shouldClearPhoto
        ? false
        : photoUpdate
          ? photoUpdate.buffer.length > 0
          : hadExistingPhoto;
    
    const isProfileComplete = requiredScalarFields.every(field => {
      const val = finalKycState[field];
      return val !== undefined && val !== null && val !== '';
    }) && hasPhotoInFinalState;
    
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
      status: newStatus,
      kyc: {
        photo: shouldClearPhoto
          ? ''
          : photoUpdate
            ? `data:${photoUpdate.mimeType};base64,${photoUpdate.buffer.toString('base64')}`
            : serializePhoto(existingKyc.photo, existingKyc.photoMimeType),
        updatedAt: updates['kyc.updatedAt'],
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
