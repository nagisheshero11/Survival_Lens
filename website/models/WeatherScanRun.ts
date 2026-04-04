import { Document, Model, Schema, model, models } from 'mongoose';

export interface IWeatherScanRun extends Document {
  startedAt: Date;
  finishedAt?: Date;
  status: 'skipped' | 'completed' | 'failed';
  reason?: string;
  scannedCities: string[];
  createdIncidents: number;
  createdNotifications: number;
  createdAt: Date;
  updatedAt: Date;
}

const weatherScanRunSchema = new Schema<IWeatherScanRun>(
  {
    startedAt: { type: Date, required: true, index: true },
    finishedAt: { type: Date },
    status: { type: String, enum: ['skipped', 'completed', 'failed'], required: true, index: true },
    reason: { type: String },
    scannedCities: { type: [String], default: [] },
    createdIncidents: { type: Number, default: 0 },
    createdNotifications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const WeatherScanRun: Model<IWeatherScanRun> =
  models.WeatherScanRun || model<IWeatherScanRun>('WeatherScanRun', weatherScanRunSchema);

export default WeatherScanRun;
