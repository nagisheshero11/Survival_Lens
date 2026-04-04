import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import Claim from '@/models/Claim';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import { POST as walletCreditAPI } from '@/app/api/wallet/credit/route';
import { logAdminTransaction } from '@/lib/adminWalletUtils';
import User from '@/models/User';
import ClaimVoting from '@/models/ClaimVoting';
import { closeVotingIfExpired } from '@/lib/claimVoting';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status || 401 });
    }

    let rawBody;
    try {
      rawBody = await request.json();
    } catch (_e) {
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

    const voting = await ClaimVoting.findOne({ claimId: claim._id });
    if (voting) {
      await closeVotingIfExpired(voting);
      if (voting.status !== 'closed') {
        return NextResponse.json({ message: "Voting is still active for this claim" }, { status: 400 });
      }
    }

    // Idempotency: Prevent re-approval or processing
    if (claim.status === 'approved' || claim.status === 'rejected') {
      return NextResponse.json({ message: `Claim is already ${claim.status}` }, { status: 400 });
    }

    // Wallet Integration
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: 'Internal Server Error: Missing JWT_SECRET' }, { status: 500 });
    }

    const tempToken = jwt.sign({ userId: claim.userId.toString() }, process.env.JWT_SECRET, { expiresIn: '5m' });
    
    const spoofedRequest = new NextRequest('http://localhost/api/wallet/credit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify({ amount: claim.amount, reason: 'claim' })
    });

    const walletRes = await walletCreditAPI(spoofedRequest);
    
    if (!walletRes.ok) {
      const errorData = await walletRes.json().catch(() => ({}));
      console.error('Wallet Credit Failed:', errorData);
      return NextResponse.json({ message: "Failed to credit wallet sync" }, { status: walletRes.status });
    }

    // Update claim after successful sync
    claim.status = 'approved';
    claim.updatedAt = new Date();
    
    await claim.save();

    const user = await User.findById(claim.userId);

    try {
      if (user) {
        await logAdminTransaction({
          type: 'debit',
          amount: claim.amount,
          source: 'claim',
          userId: claim.userId.toString(),
          userName: user.fullName || 'Unknown',
          referenceId: claim._id.toString()
        });
      }
    } catch (adminErr) {
      console.error('Failed to log admin debit transaction for claim:', adminErr);
    }

    return NextResponse.json({ message: "Claim approved" }, { status: 200 });

  } catch (error) {
    console.error('Admin Claims Approve Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
