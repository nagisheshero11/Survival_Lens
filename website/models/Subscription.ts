import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planAmount: number;
  planName: string;
  startDate: Date;
  lastPaymentDate: Date | null;
  totalPayments: number;
  duePayments: number;
  status: 'active' | 'inactive' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  planAmount: {
    type: Number,
    required: true
  },
  planName: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastPaymentDate: {
    type: Date,
    default: null
  },
  totalPayments: {
    type: Number,
    default: 0
  },
  duePayments: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'active'
  }
}, { timestamps: true });

const Subscription: Model<ISubscription> = models.Subscription || model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
