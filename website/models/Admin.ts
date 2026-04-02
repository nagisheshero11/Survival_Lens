import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  createdAt: Date;
}

const adminSchema = new Schema<IAdmin>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Avoid OverwriteModelError in Next.js development
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
