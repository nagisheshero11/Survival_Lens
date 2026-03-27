import { Document, Schema } from 'mongoose';
import connectCompanyDB from '@/lib/companyDb';

export interface IWorkerProfile extends Document {
  userId: string;
  company: string;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  avgOrdersPerDay: number;
  avgEarningPerOrder: number;
  avgDailyIncome: number;
  acceptanceRate: number;
  completionRate: number;
  rating: number;
  city: string;
  zone: string;
  createdAt: Date;
}

const workerProfileSchema = new Schema<IWorkerProfile>({
  userId: { type: String, required: true, index: true },
  company: { type: String, required: true },
  workingHoursPerDay: { type: Number },
  workingDaysPerWeek: { type: Number },
  avgOrdersPerDay: { type: Number },
  avgEarningPerOrder: { type: Number },
  avgDailyIncome: { type: Number },
  acceptanceRate: { type: Number },
  completionRate: { type: Number },
  rating: { type: Number },
  city: { type: String },
  zone: { type: String }
}, { timestamps: true });

export const getWorkerProfileModel = async () => {
  const conn = await connectCompanyDB();
  return conn.models.WorkerProfile || conn.model<IWorkerProfile>('WorkerProfile', workerProfileSchema);
};
