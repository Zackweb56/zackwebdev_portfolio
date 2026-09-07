import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Load .env.local manually if not in Next environment
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ Error: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const email = process.argv[2] || process.env.ADMIN_EMAIL || "admin@bz.dev";
const password = process.argv[3] || process.env.ADMIN_PASSWORD || "AdminSecure2026!";
const name = process.env.ADMIN_NAME || "Zakariyae Boughaba";

async function main() {
  console.log("🔒 Connecting to MongoDB Atlas...");
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "portfolio_master_db");

  console.log(`📦 Configuring Better Auth for admin: ${email}`);

  const auth = betterAuth({
    secret:
      process.env.BETTER_AUTH_SECRET ||
      process.env.AUTH_SECRET ||
      "9f8e7d6c5b4a3928172635445566778899aabbccddeeff001122334455667788",
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
  });

  // Clean all existing records for this email
  const existingUsers = await db.collection("user").find({ email }).toArray();
  for (const u of existingUsers) {
    console.log(`ℹ️ Cleaning existing records for user: ${u.email} (ID: ${u._id})`);
    await db.collection("account").deleteMany({ userId: u._id });
    await db.collection("account").deleteMany({ userId: u._id.toString() });
    await db.collection("session").deleteMany({ userId: u._id });
    await db.collection("session").deleteMany({ userId: u._id.toString() });
    await db.collection("user").deleteOne({ _id: u._id });
  }

  console.log(`🚀 Creating single admin user in MongoDB Atlas: ${email}`);
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (result && result.user) {
    console.log("✅ Admin user created successfully in MongoDB Atlas!");
    console.log(`   Email: ${result.user.email}`);
    console.log(`   ID:    ${result.user.id || result.user._id}`);
    console.log("   Access Portal: /access_bz_admin");
  } else {
    console.log("⚠️ Could not verify signup response:", result);
  }

  await client.close();
}

main().catch((err) => {
  console.error("❌ Error seeding admin:", err);
  process.exit(1);
});
