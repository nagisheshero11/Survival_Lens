import mongoose, { Document, Model, Schema, model, models } from 'mongoose';

export interface IUserNotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'weather-incident' | 'system';
  incidentId?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['weather-incident', 'system'], default: 'system' },
    incidentId: { type: Schema.Types.ObjectId, ref: 'VotingIncident' },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

userNotificationSchema.index({ userId: 1, createdAt: -1 });

const UserNotification: Model<IUserNotification> =
  models.UserNotification || model<IUserNotification>('UserNotification', userNotificationSchema);

export default UserNotification;
