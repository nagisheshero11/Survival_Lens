import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface ITransaction {
  type: 'credit' | 'debit';
  amount: number;
  reason: 'claim' | 'withdraw' | 'premium';
  status: 'pending' | 'completed' | 'failed';
  paymentRef: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  transactions: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: { type: Number, required: true },
  reason: {
    type: String,
    enum: ['claim', 'withdraw', 'premium'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true,
  },
  paymentRef: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const walletSchema = new Schema<IWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 300,
  },
  transactions: {
    type: [transactionSchema],
    default: [],
  },
}, { timestamps: true });

const Wallet: Model<IWallet> = models.Wallet || model<IWallet>('Wallet', walletSchema);

export default Wallet;
