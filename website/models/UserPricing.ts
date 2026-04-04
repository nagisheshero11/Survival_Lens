import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IPlan {
  planType: 'basic' | 'standard' | 'premium';
  price: number;
  benefitAmount: number;
}

export interface IUserPricing extends Document {
  userId: mongoose.Types.ObjectId;
  plans: IPlan[];
  selectedPlan: IPlan | null;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>({
  planType: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  benefitAmount: {
    type: Number,
    required: true
  }
});

const userPricingSchema = new Schema<IUserPricing>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plans: {
    type: [planSchema],
    default: []
  },
  selectedPlan: {
    type: planSchema,
    default: null
  }
}, { timestamps: true });

const UserPricing: Model<IUserPricing> = models.UserPricing || model<IUserPricing>('UserPricing', userPricingSchema);

export default UserPricing;
