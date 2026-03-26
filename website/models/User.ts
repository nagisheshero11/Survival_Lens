import { Document, Model, Schema, models, model } from 'mongoose';

export const COMPANY_CATEGORY_MAP: Record<string, string[]> = {
  "Food Delivery": ["Zomato", "Swiggy"],
  "Quick Commerce": ["Blinkit", "Zepto", "Swiggy Instamart", "BigBasket Now", "Flipkart Minutes"],
  "E-commerce & Marketplaces": ["Amazon India", "Flipkart", "Meesho", "Myntra"],
  "Logistics & Delivery-as-a-Service": ["Delhivery", "Shadowfax", "Ecom Express", "Porter", "Shiprocket", "XpressBees"],
  "Pharmacy & Healthcare": ["PharmEasy", "Tata 1mg", "Apollo Pharmacy"],
  "D2C Brands": ["Nykaa", "Mamaearth", "boAt"],
  "Hyperlocal & Multi-service": ["Dunzo", "Borzo", "WeFast"]
};

export const ALLOWED_CATEGORIES = Object.keys(COMPANY_CATEGORY_MAP);
export const ALLOWED_COMPANIES = Object.values(COMPANY_CATEGORY_MAP).flat();

export interface ICompany {
  category: string;
  company: string;
  partnerId?: string;
  dashboardScreenshot?: string;
  verified: boolean;
}

const companySchema = new Schema<ICompany>({
  category: { type: String, required: true, enum: ALLOWED_CATEGORIES },
  company: { type: String, required: true, enum: ALLOWED_COMPANIES },
  partnerId: { type: String, default: '' },
  dashboardScreenshot: { type: String, default: '' },
  verified: { type: Boolean, default: false }
});

export interface IKyc {
  aadhaar: string;
  pan: string;
  photo: string;
  city: string;
  age?: number;
  companies: ICompany[];
  avgWeeklyIncome?: number;
  avgWorkingHours?: number;
  status: "not_started" | "partial" | "pending" | "approved" | "rejected";
  updatedAt: Date;
}

export interface IUser extends Document {
  fullName: string;
  mobile: string;
  email: string;
  password?: string;
  kyc: IKyc;
  createdAt: Date;
  updatedAt: Date;
}

const kycSchema = new Schema<IKyc>({
  aadhaar: { type: String, default: '' },
  pan: { type: String, default: '' },
  photo: { type: String, default: '' },
  city: { type: String, default: '' },
  age: { type: Number },
  companies: { 
    type: [companySchema], 
    default: [],
    validate: {
      validator: function(v: ICompany[]) {
        if (!v || v.length === 0) return true;
        const firstCategory = v[0].category;
        return v.every(c => c.category === firstCategory);
      },
      message: 'All companies must belong to the same category.'
    }
  },
  avgWeeklyIncome: { type: Number },
  avgWorkingHours: { type: Number },
  status: {
    type: String,
    enum: ["not_started", "partial", "pending", "approved", "rejected"],
    default: "not_started"
  },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  kyc: { type: kycSchema, default: () => ({ status: 'not_started' }) }
}, { timestamps: true });

const User: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default User;
