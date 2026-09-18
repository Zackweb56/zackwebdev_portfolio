import { NextResponse } from "next/server";
import { getActiveLanguages } from "@/backend/dal/languages";

export const dynamic = "force-dynamic";

/**
 * GET /api/languages
 * Public endpoint to fetch currently active languages for portfolio navigation.
 */
export async function GET() {
  try {
    const languages = await getActiveLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error("[API_LANGUAGES_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to retrieve active languages" },
      { status: 500 }
    );
  }
}
