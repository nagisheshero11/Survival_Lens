import { Document, Model, Schema, model, models } from 'mongoose';

export interface ISystemJobState extends Document {
  jobKey: string;
  lastRanAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

const systemJobStateSchema = new Schema<ISystemJobState>(
  {
    jobKey: { type: String, required: true, unique: true, index: true },
    lastRanAt: { type: Date },
  },
  { timestamps: true }
);

const SystemJobState: Model<ISystemJobState> =
  models.SystemJobState || model<ISystemJobState>('SystemJobState', systemJobStateSchema);

export default SystemJobState;
