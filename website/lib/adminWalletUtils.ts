import AdminWallet, { IAdminTransaction } from '@/models/AdminWallet';
import mongoose from 'mongoose';

export async function logAdminTransaction({
  type,
  amount,
  source,
  userId,
  userName,
  referenceId
}: {
  type: 'credit' | 'debit';
  amount: number;
  source: 'premium' | 'claim';
  userId: string | mongoose.Types.ObjectId;
  userName: string;
  referenceId: string;
}) {
  const transaction: Partial<IAdminTransaction> = {
    type,
    amount,
    source,
    userId: new mongoose.Types.ObjectId(userId.toString()),
    userName,
    referenceId,
    createdAt: new Date()
  };

  const balanceChange = type === 'credit' ? amount : -amount;

  // Use findOneAndUpdate with upsert: true and $setOnInsert to gracefully initialize 
  // the singleton AdminWallet document if it doesn't exist yet, while applying
  // the $inc and $push atomically. We don't define an _id for it to find, we just 
  // update the very first/only document we find (or insert it).
  // A standard way to ensure a singleton is to use a specific fixed ID or query {}, 
  // wait we can use a fixed field like { _id: new mongoose.Types.ObjectId("60d6c0a0c9b0e274a101b000") } 
  // or just use { isSingleton: true }. Let's use a dummy field as identifier.

  const ADMIN_WALLET_ID = "singleton_admin_wallet";

  const result = await AdminWallet.findOneAndUpdate(
    { }, // matches the first doc it finds
    {
      $inc: { balance: balanceChange },
      $push: { transactions: transaction }
    },
    { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return result;
}
