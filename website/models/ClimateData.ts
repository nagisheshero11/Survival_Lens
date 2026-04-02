import { Document, Schema } from 'mongoose';
import connectCompanyDB from '@/lib/companyDb';

export interface IClimateData extends Document {
  city: string;
  avgTemperature: number;
  avgRainfallMm: number;
  floodRiskIndex: number;
  historicalDisruptions: number;
  calculatedRiskMultiplier: number;
  createdAt: Date;
  updatedAt: Date;
}

const climateDataSchema = new Schema<IClimateData>({
  city: { type: String, required: true, index: true },
  avgTemperature: { type: Number, required: true },
  avgRainfallMm: { type: Number, required: true },
  floodRiskIndex: { type: Number, required: true },
  historicalDisruptions: { type: Number, required: true },
  calculatedRiskMultiplier: { type: Number, required: true }
}, { timestamps: true, collection: 'ClimateData' }); // Force collection name to 'ClimateData' exactly

export const getClimateDataModel = async () => {
  const conn = await connectCompanyDB();
  const weatherDb = conn.useDb('Weather', { useCache: true });
  return weatherDb.models.ClimateData || weatherDb.model<IClimateData>('ClimateData', climateDataSchema);
};
