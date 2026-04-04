import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface IVotingIncident extends Document {
  sourceCity: string;
  sourceCoordinates: {
    lat: number;
    lon: number;
  };
  targetCities: string[];
  targetCitiesNormalized: string[];
  targetUserIds: mongoose.Types.ObjectId[];
  riskLevel: RiskLevel;
  action: string;
  safetyProbability: number;
  weather: {
    temperatureCelsius: number;
    rainMmHr: number;
    windspeedKmh: number;
  };
  status: 'open' | 'closed';
  votes: number;
  voterIds: mongoose.Types.ObjectId[];
  windowStartAt: Date;
  windowEndAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const votingIncidentSchema = new Schema<IVotingIncident>(
  {
    sourceCity: { type: String, required: true, index: true },
    sourceCoordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    targetCities: { type: [String], required: true, default: [] },
    targetCitiesNormalized: { type: [String], required: true, default: [], index: true },
    targetUserIds: { type: [Schema.Types.ObjectId], ref: 'User', required: true, default: [], index: true },
    riskLevel: { type: String, enum: ['SAFE', 'WARNING', 'CRITICAL'], required: true },
    action: { type: String, required: true },
    safetyProbability: { type: Number, required: true },
    weather: {
      temperatureCelsius: { type: Number, required: true },
      rainMmHr: { type: Number, required: true },
      windspeedKmh: { type: Number, required: true },
    },
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
    votes: { type: Number, default: 0 },
    voterIds: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    windowStartAt: { type: Date, required: true, index: true },
    windowEndAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

votingIncidentSchema.index({ sourceCity: 1, windowStartAt: 1 }, { unique: true });

const VotingIncident: Model<IVotingIncident> =
  models.VotingIncident || model<IVotingIncident>('VotingIncident', votingIncidentSchema);

export default VotingIncident;
