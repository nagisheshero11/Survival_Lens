import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/middleware/auth';
import Claim from '@/models/Claim';
import connectDB from '@/lib/db';

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

    const { reason, amount } = rawBody;

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return NextResponse.json({ message: "Reason must not be empty" }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: "Amount must be a positive number" }, { status: 400 });
    }

    await connectDB();

    await Claim.create({
      userId: currentUser._id,
      reason,
      amount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      message: "Claim submitted", 
      status: "pending" 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Claims POST Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    const currentUser = authResult.user;
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await connectDB();

    const claims = await Claim.find({ userId: currentUser._id })
      .sort({ createdAt: -1 })
      .select('reason amount status createdAt -_id');

    return NextResponse.json(claims, { status: 200 });

  } catch (error: any) {
    console.error('Claims GET Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
