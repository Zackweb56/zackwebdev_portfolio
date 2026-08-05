import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Implemented in Task 9.5 (logout + session expiration).
 */
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — see Task 9.5" },
    { status: 501 }
  );
}
