import { Document, Model, Schema, models, model } from 'mongoose';

export interface IKyc {
  aadhaar: string;
  pan: string;
  photo: string;
  city: string;
  age?: number;
  company: string;
  avgWeeklyIncome?: number;
  avgWorkingHours?: number;
  status: "not_started" | "partial" | "pending" | "approved" | "rejected";
  updatedAt: Date;
}

export interface IUser extends Document {
  fullName: string;
  mobile: string;
  email: string;
  password?: string;
  kyc: IKyc;
  createdAt: Date;
  updatedAt: Date;
}

const kycSchema = new Schema<IKyc>({
  aadhaar: { type: String, default: '' },
  pan: { type: String, default: '' },
  photo: { type: String, default: '' },
  city: { type: String, default: '' },
  age: { type: Number },
  company: { type: String, default: '' },
  avgWeeklyIncome: { type: Number },
  avgWorkingHours: { type: Number },
  status: {
    type: String,
    enum: ["not_started", "partial", "pending", "approved", "rejected"],
    default: "not_started"
  },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  kyc: { type: kycSchema, default: () => ({ status: 'not_started' }) }
}, { timestamps: true });

const User: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default User;
