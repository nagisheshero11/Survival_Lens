const mongoose = require('mongoose');

const uri = "mongodb+srv://hemanthsai964_db_user:y5QE4G5OKuPAixmh@companyapis.c8jcza6.mongodb.net/?appName=CompanyAPIs";

const mockCompanyDataSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  partnerId: { type: String, required: true, unique: true },
  avgWeeklyIncome: { type: Number, required: true },
  avgWorkingHours: { type: Number, required: true },
  avgDeliveries: { type: Number, required: true }
}, { timestamps: true });

const dummyData = [
  { companyName: "Swiggy", partnerId: "SW12345", avgWeeklyIncome: 3500, avgWorkingHours: 42, avgDeliveries: 105 },
  { companyName: "Zomato", partnerId: "ZO98765", avgWeeklyIncome: 4200, avgWorkingHours: 50, avgDeliveries: 125 },
  { companyName: "Uber", partnerId: "UB55555", avgWeeklyIncome: 5000, avgWorkingHours: 35, avgDeliveries: 40 }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas CompanyAPIs cluster...");
    const conn = await mongoose.createConnection(uri).asPromise();
    const MockCompanyData = conn.model('MockCompanyData', mockCompanyDataSchema);
    
    console.log("Clearing existing mock data...");
    await MockCompanyData.deleteMany({});
    
    console.log("Inserting dummy data...");
    await MockCompanyData.insertMany(dummyData);
    
    console.log("Successfully inserted dummy data into CompanyAPIs DB.");
    await conn.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
}

seed();
