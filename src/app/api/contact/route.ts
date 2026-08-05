import { NextResponse } from "next/server";

/**
 * POST /api/contact
 *
 * Accepts public contact form submissions.
 * Full implementation in Task 7.3 (server-side submission) and Task 7.4 (rate limiting).
 *
 * Future layers:
 *   - Zod validation (shared/schemas/contact.schema.ts)
 *   - Rate limiting (backend/auth/rateLimit.ts)
 *   - Input sanitization
 *   - Message service (backend/services/message.service.ts)
 */
export async function POST() {
  // Placeholder — not yet implemented
  return NextResponse.json(
    { error: "Not implemented — see Task 7.3" },
    { status: 501 }
  );
}
