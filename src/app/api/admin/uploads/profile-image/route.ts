import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { PortfolioContent } from "@/backend/models/PortfolioContent";
import cloudinary, { isValidCloudinaryUrl } from "@/backend/lib/cloudinary";

/**
 * Extracts the Cloudinary public_id from a secure delivery URL.
 * Example: https://res.cloudinary.com/<cloud>/image/upload/v123/portfolio/profile/abc.jpg
 *          → "portfolio/profile/abc"  (no extension, version stripped)
 */
function extractPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // pathname: /<cloud>/image/upload/v<version>/<public_id>.<ext>
    // or:       /<cloud>/raw/upload/v<version>/<public_id>.<ext>
    const parts = parsed.pathname.split("/");
    // Find the "upload" segment index
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    // Skip version segment if present (starts with "v" followed by digits)
    let startIdx = uploadIdx + 1;
    if (/^v\d+$/.test(parts[startIdx] || "")) startIdx++;
    // Remaining parts form the public_id (strip file extension from last part)
    const remaining = parts.slice(startIdx);
    if (!remaining.length) return null;
    const last = remaining[remaining.length - 1].replace(/\.[^.]+$/, "");
    remaining[remaining.length - 1] = last;
    return remaining.join("/");
  } catch {
    return null;
  }
}

/**
 * POST /api/admin/uploads/profile-image
 *
 * Persists the Cloudinary delivery URL for the admin profile image to MongoDB.
 * Before saving the new URL, destroys the old Cloudinary asset to free storage.
 * Validates domain and authenticated admin role before updating.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const secureUrl = body.secureUrl || body.url;

    if (!secureUrl || typeof secureUrl !== "string") {
      return NextResponse.json({ error: "Missing or invalid secureUrl" }, { status: 400 });
    }

    if (!isValidCloudinaryUrl(secureUrl)) {
      return NextResponse.json(
        { error: "Invalid Cloudinary delivery URL or untrusted origin" },
        { status: 400 }
      );
    }

    await connectMongoose();

    // ── Read existing profile image and destroy old Cloudinary asset ──────────
    const existing = await PortfolioContent.findOne({}).lean() as any;
    const oldUrl: string | undefined = existing?.profile?.identity?.profileImage;
    if (oldUrl && isValidCloudinaryUrl(oldUrl) && oldUrl !== secureUrl) {
      const oldPublicId = extractPublicId(oldUrl);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: "image",
            invalidate: true,
          });
        } catch (destroyErr) {
          // Non-fatal: log but do not block the save
          console.warn("[PROFILE_IMAGE_UPLOAD] Could not destroy old Cloudinary asset:", destroyErr);
        }
      }
    }

    // ── Save new URL to DB ────────────────────────────────────────────────────
    const updated = await PortfolioContent.findOneAndUpdate(
      {},
      {
        $set: {
          "profile.identity.profileImage": secureUrl,
          updatedBy: auth.user.email,
        },
      },
      { upsert: true, new: true, lean: true }
    );

    return NextResponse.json({
      success: true,
      profileImage: (updated as any)?.profile?.identity?.profileImage ?? secureUrl,
    });
  } catch (err: any) {
    console.error("[PROFILE_IMAGE_UPLOAD_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

