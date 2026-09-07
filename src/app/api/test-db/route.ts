import { NextResponse } from "next/server";
import { pingDatabase } from "@/backend/db/mongodb";

/**
 * GET /api/test-db
 *
 * Verifies MongoDB Atlas connectivity, measures round-trip latency,
 * and returns structured JSON diagnostic health status.
 *
 * Security:
 *   - NEVER exposes database passwords, user credentials, or raw connection strings.
 *   - Returns sanitized diagnostic status suitable for administrative verification.
 */
export async function GET() {
  try {
    const result = await pingDatabase();

    if (result.connected) {
      return NextResponse.json(
        {
          success: true,
          status: "connected",
          provider: "MongoDB Atlas",
          database: result.database,
          latencyMs: result.latencyMs,
          timestamp: new Date().toISOString(),
          message: "MongoDB Atlas cluster connection verified successfully.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          status: "disconnected",
          provider: "MongoDB Atlas",
          error: result.error || "Could not establish connection to MongoDB Atlas",
          hint: "Verify that MONGODB_URI is correctly configured in .env.local and that your IP address is whitelisted in MongoDB Atlas Network Access.",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Database Check Error";

    return NextResponse.json(
      {
        success: false,
        status: "error",
        error: message.replace(/\/\/[^@]+@/, "//***:***@"),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
