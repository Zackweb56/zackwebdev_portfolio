import mongoose from "mongoose";

/**
 * Mongoose ODM Cached Connection Helper
 *
 * Provides a robust cached Mongoose connection for Next.js App Router API routes & Server Actions.
 * Enforces IPv4 (family: 4) to eliminate ENETUNREACH / ETIMEDOUT errors on dual-stack hosts.
 */

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectMongoose(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is missing. Define it in .env.local"
    );
  }

  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: process.env.MONGODB_DB_NAME || "portfolio_master_db",
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent IPv6 DNS timeout (ETIMEDOUT / ENETUNREACH)
    };

    cached!.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectMongoose;
