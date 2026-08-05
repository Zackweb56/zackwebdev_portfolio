import { NextResponse } from "next/server";

/**
 * POST /api/cloudinary/sign
 *
 * Generates a secure upload signature for client-side Cloudinary uploads.
 * Never expose the CLOUDINARY_API_SECRET to the browser.
 * Implemented in Task 11.2 (secure upload flow).
 */
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — see Task 11.2" },
    { status: 501 }
  );
}
