import { Document, Model, Schema, models, model } from 'mongoose';

export interface IMockCompanyData extends Document {
  companyName: string;
  partnerId: string;
  avgWeeklyIncome: number;
  avgWorkingHours: number;
  avgDeliveries: number;
  createdAt: Date;
  updatedAt: Date;
}

const mockCompanyDataSchema = new Schema<IMockCompanyData>({
  companyName: { type: String, required: true },
  partnerId: { type: String, required: true, unique: true },
  avgWeeklyIncome: { type: Number, required: true },
  avgWorkingHours: { type: Number, required: true },
  avgDeliveries: { type: Number, required: true }
}, { timestamps: true });

import connectCompanyDB from '@/lib/companyDb';

export const getMockCompanyModel = async () => {
  const conn = await connectCompanyDB();
  return conn.models.MockCompanyData || conn.model<IMockCompanyData>('MockCompanyData', mockCompanyDataSchema);
};
