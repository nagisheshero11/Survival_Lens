import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export type VoteChoice = 'yes' | 'no';

export interface IClaimVote {
  userId: mongoose.Types.ObjectId;
  vote: VoteChoice;
  createdAt: Date;
}

export interface IClaimVotingResult {
  yesCount: number;
  noCount: number;
}

export interface IClaimVoting extends Document {
  claimId: mongoose.Types.ObjectId;
  city: string;
  votes: IClaimVote[];
  startTime: Date;
  endTime: Date;
  status: 'active' | 'closed';
  result: IClaimVotingResult;
  createdAt: Date;
  updatedAt: Date;
}

const claimVoteSchema = new Schema<IClaimVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vote: { type: String, enum: ['yes', 'no'], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const claimVotingSchema = new Schema<IClaimVoting>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, unique: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    votes: { type: [claimVoteSchema], default: [] },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true, index: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active', index: true },
    result: {
      yesCount: { type: Number, default: 0 },
      noCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const ClaimVoting: Model<IClaimVoting> =
  models.ClaimVoting || model<IClaimVoting>('ClaimVoting', claimVotingSchema);

export default ClaimVoting;
