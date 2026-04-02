import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: string;
  method: string;
  status: 'success' | 'failed';
  paymentRef: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: {
    type: String,
    enum: ['premium'],
    default: 'premium',
    required: true,
  },
  method: {
    type: String,
    enum: ['wallet'],
    default: 'wallet',
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true,
  },
  paymentRef: { 
    type: String, 
    required: true,
    unique: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment: Model<IPayment> = models.Payment || model<IPayment>('Payment', paymentSchema);

export default Payment;
