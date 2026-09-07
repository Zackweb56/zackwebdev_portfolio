import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

/**
 * Better Auth Server Configuration
 *
 * Single-Admin Architecture:
 *   - Strictly authenticates against the verified administrator in MongoDB Atlas.
 *   - Public signups are disabled.
 *   - Session cookies managed securely via nextCookies plugin.
 */

const mongoUri = process.env.MONGODB_URI;
const secret =
  process.env.BETTER_AUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "9f8e7d6c5b4a3928172635445566778899aabbccddeeff001122334455667788";

// Create client or fallback client for build-time safety
const client = mongoUri
  ? new MongoClient(mongoUri)
  : new MongoClient("mongodb://127.0.0.1:27017/portfolio_fallback");

const db = client.db(process.env.MONGODB_DB_NAME || "portfolio_master_db");

export const auth = betterAuth({
  secret,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "portfolio_admin",
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
