import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IAdminTransaction {
  type: 'credit' | 'debit';
  amount: number;
  source: 'premium' | 'claim';
  userId: mongoose.Types.ObjectId;
  userName: string;
  referenceId: string; // paymentId or claimId
  createdAt: Date;
}

export interface IAdminWallet extends Document {
  balance: number;
  transactions: IAdminTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const adminTransactionSchema = new Schema<IAdminTransaction>({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: { type: Number, required: true },
  source: {
    type: String,
    enum: ['premium', 'claim'],
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { type: String, required: true },
  referenceId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const adminWalletSchema = new Schema<IAdminWallet>({
  balance: {
    type: Number,
    default: 0,
  },
  transactions: {
    type: [adminTransactionSchema],
    default: [],
  },
}, { timestamps: true });

const AdminWallet: Model<IAdminWallet> = models.AdminWallet || model<IAdminWallet>('AdminWallet', adminWalletSchema);

export default AdminWallet;
