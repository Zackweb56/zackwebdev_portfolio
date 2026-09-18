import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import cloudinary, { ALLOWED_UPLOAD_FOLDERS, AllowedUploadFolder } from "@/backend/lib/cloudinary";

/**
 * POST /api/cloudinary/sign
 *
 * Generates a secure upload signature for client-side Cloudinary uploads (BFF pattern).
 * The API secret is never exposed to the client.
 *
 * Requirements:
 * - Admin session authenticated via Better Auth (requireAdminApiAuth)
 * - Validated folder against allowlist: ["portfolio/profile", "portfolio/cv", "portfolio/projects"]
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { folder = "portfolio/profile", publicId } = body;

    // Validate folder against strict allowlist
    if (!ALLOWED_UPLOAD_FOLDERS.includes(folder as AllowedUploadFolder)) {
      return NextResponse.json(
        {
          error: `Invalid upload folder. Allowed: ${ALLOWED_UPLOAD_FOLDERS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { error: "Cloudinary service not properly configured on server" },
        { status: 500 }
      );
    }

    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
    };

    if (publicId && typeof publicId === "string") {
      paramsToSign.public_id = publicId;
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err: any) {
    console.error("[CLOUDINARY_SIGN_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
