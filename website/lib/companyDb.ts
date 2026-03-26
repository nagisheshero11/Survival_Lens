import mongoose, { Connection } from 'mongoose';

const COMPANY_MONGODB_URI = process.env.COMPANY_MONGO_URI as string;

if (!COMPANY_MONGODB_URI) {
  throw new Error('Please define the COMPANY_MONGO_URI environment variable inside .env');
}

// Ensure the global object has the companyMongoose property for Next.js hot-reloading
declare global {
  var companyMongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

let cached = global.companyMongoose;

if (!cached) {
  cached = global.companyMongoose = { conn: null, promise: null };
}

async function connectCompanyDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.createConnection(COMPANY_MONGODB_URI, opts).asPromise();
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectCompanyDB;
