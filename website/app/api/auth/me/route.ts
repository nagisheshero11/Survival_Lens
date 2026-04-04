import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';

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

function serializeKyc(kyc: unknown) {
  if (!kyc || typeof kyc !== 'object') return kyc;

  const source = kyc as Record<string, unknown>;
  const serialized = { ...source } as Record<string, unknown>;
  const mimeType =
    typeof source.photoMimeType === 'string' && source.photoMimeType.trim()
      ? source.photoMimeType.trim()
      : DEFAULT_PHOTO_MIME;

  const photoBuffer = normalizePhotoBuffer(source.photo);
  if (photoBuffer && photoBuffer.length > 0) {
    serialized.photo = `data:${mimeType};base64,${photoBuffer.toString('base64')}`;
  } else if (typeof source.photo === 'string') {
    serialized.photo = source.photo.trim();
  } else {
    serialized.photo = '';
  }

  return serialized;
}

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
        kyc: serializeKyc(user.kyc)
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
