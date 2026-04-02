import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IClaim extends Document {
  userId: mongoose.Types.ObjectId;
  reason: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const claimSchema = new Schema<IClaim>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const Claim: Model<IClaim> = models.Claim || model<IClaim>('Claim', claimSchema);

export default Claim;
