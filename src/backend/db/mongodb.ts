import { MongoClient, ServerApiVersion, Db } from "mongodb";

/**
 * MongoDB Atlas Connection Pool & Client Singleton
 *
 * Implements persistent connection caching across Next.js serverless invocations
 * and fast-refresh cycles to prevent exhausting MongoDB Atlas connection limits.
 */

const uri = process.env.MONGODB_URI || "";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  // In development/build without URI, provide a deferred promise that rejects when awaited
  clientPromise = Promise.reject(
    new Error(
      "MONGODB_URI environment variable is missing. Please define it in your .env.local file."
    )
  );
} else {
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10,
    minPoolSize: 1,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4
  };

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

/**
 * Returns the cached MongoClient promise
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add your MongoDB Atlas connection string to .env.local"
    );
  }
  return clientPromise;
}

/**
 * Returns the default database instance from the cached client
 */
export async function getDb(dbName?: string): Promise<Db> {
  const connectedClient = await getMongoClient();
  return connectedClient.db(dbName || process.env.MONGODB_DB_NAME || "portfolio");
}

/**
 * Health check utility to ping MongoDB Atlas and measure round-trip latency
 */
export async function pingDatabase(): Promise<{
  connected: boolean;
  database: string;
  latencyMs: number;
  error?: string;
}> {
  if (!process.env.MONGODB_URI) {
    return {
      connected: false,
      database: "unknown",
      latencyMs: 0,
      error: "MONGODB_URI is not defined in environment variables",
    };
  }

  const startTime = Date.now();
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const latencyMs = Date.now() - startTime;

    return {
      connected: true,
      database: db.databaseName,
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMessage =
      err instanceof Error ? err.message : "Failed to connect to MongoDB Atlas";

    // Clean any sensitive connection info from the error message
    const sanitizedError = errorMessage.replace(/\/\/[^@]+@/, "//***:***@");

    return {
      connected: false,
      database: "unknown",
      latencyMs,
      error: sanitizedError,
    };
  }
}

export default clientPromise;
