import { NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * Implemented in Task 9.2 (admin authentication).
 */
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — see Task 9.2" },
    { status: 501 }
  );
}
