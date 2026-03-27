import { Document, Schema } from 'mongoose';
import connectCompanyDB from '@/lib/companyDb';

export interface IDailyActivity extends Document {
  userId: string;
  date: Date;
  hoursWorked: number;
  activeTime: number;
  ordersAssigned: number;
  ordersAccepted: number;
  ordersCompleted: number;
  ordersCancelled: number;
  baseEarnings: number;
  incentives: number;
  tips: number;
  totalEarnings: number;
  surgeMultiplier: number;
  weather: string;
  createdAt: Date;
}

const dailyActivitySchema = new Schema<IDailyActivity>({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  hoursWorked: { type: Number },
  activeTime: { type: Number },
  ordersAssigned: { type: Number },
  ordersAccepted: { type: Number },
  ordersCompleted: { type: Number },
  ordersCancelled: { type: Number },
  baseEarnings: { type: Number },
  incentives: { type: Number },
  tips: { type: Number },
  totalEarnings: { type: Number },
  surgeMultiplier: { type: Number },
  weather: { type: String }
}, { timestamps: true });

export const getDailyActivityModel = async () => {
  const conn = await connectCompanyDB();
  return conn.models.DailyActivity || conn.model<IDailyActivity>('DailyActivity', dailyActivitySchema);
};
