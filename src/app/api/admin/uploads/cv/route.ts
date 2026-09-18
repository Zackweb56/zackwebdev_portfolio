import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { PortfolioContent } from "@/backend/models/PortfolioContent";
import cloudinary, { isValidCloudinaryUrl } from "@/backend/lib/cloudinary";

/**
 * Extracts the Cloudinary public_id from a secure delivery URL.
 * Works for both image and raw (PDF/DOCX) assets.
 */
function extractPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/");
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    let startIdx = uploadIdx + 1;
    if (/^v\d+$/.test(parts[startIdx] || "")) startIdx++;
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
 * POST /api/admin/uploads/cv
 *
 * Saves a per-language CV delivery URL (PDF or DOCX) to the profile.resume.cvFiles map.
 * Before saving, destroys any existing CV for that locale from Cloudinary.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { locale, secureUrl, originalName } = body;

    if (!locale || typeof locale !== "string" || locale.trim().length > 10) {
      return NextResponse.json({ error: "Invalid locale provided" }, { status: 400 });
    }

    const cleanLocale = locale.trim().toLowerCase();

    if (!secureUrl || typeof secureUrl !== "string") {
      return NextResponse.json({ error: "Missing secureUrl" }, { status: 400 });
    }

    if (!isValidCloudinaryUrl(secureUrl)) {
      return NextResponse.json(
        { error: "Invalid Cloudinary URL or untrusted origin" },
        { status: 400 }
      );
    }

    await connectMongoose();

    // ── Destroy old CV for this locale from Cloudinary ────────────────────────
    const existing = await PortfolioContent.findOne({}).lean() as any;
    const oldUrl: string | undefined = existing?.profile?.resume?.cvFiles?.[cleanLocale];
    if (oldUrl && isValidCloudinaryUrl(oldUrl) && oldUrl !== secureUrl) {
      const oldPublicId = extractPublicId(oldUrl);
      if (oldPublicId) {
        try {
          // CVs are uploaded as "raw" resource type in Cloudinary
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: "raw",
            invalidate: true,
          });
        } catch (destroyErr) {
          console.warn("[CV_UPLOAD] Could not destroy old Cloudinary CV asset:", destroyErr);
        }
      }
    }

    // ── Save new CV URL for locale ─────────────────────────────────────────────
    const updateQuery: Record<string, any> = {
      $set: {
        [`profile.resume.cvFiles.${cleanLocale}`]: secureUrl,
        updatedBy: auth.user.email,
      },
    };

    if (originalName && typeof originalName === "string") {
      updateQuery.$set["profile.resume.downloadFilename"] = originalName;
    }

    const updated = await PortfolioContent.findOneAndUpdate({}, updateQuery, {
      upsert: true,
      new: true,
      lean: true,
    });

    return NextResponse.json({
      success: true,
      locale: cleanLocale,
      cvFiles: (updated as any)?.profile?.resume?.cvFiles ?? { [cleanLocale]: secureUrl },
    });
  } catch (err: any) {
    console.error("[CV_UPLOAD_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/uploads/cv?locale=fr
 *
 * Removes a per-language CV URL from the database AND destroys the asset from Cloudinary.
 */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale");

    if (!locale || typeof locale !== "string") {
      return NextResponse.json({ error: "Missing locale query parameter" }, { status: 400 });
    }

    const cleanLocale = locale.trim().toLowerCase();

    await connectMongoose();

    // ── Read existing URL before deleting from DB ─────────────────────────────
    const existing = await PortfolioContent.findOne({}).lean() as any;
    const oldUrl: string | undefined = existing?.profile?.resume?.cvFiles?.[cleanLocale];

    // ── Remove from DB ────────────────────────────────────────────────────────
    const updated = await PortfolioContent.findOneAndUpdate(
      {},
      {
        $unset: {
          [`profile.resume.cvFiles.${cleanLocale}`]: 1,
        },
        $set: {
          updatedBy: auth.user.email,
        },
      },
      { new: true, lean: true }
    );

    // ── Destroy from Cloudinary ───────────────────────────────────────────────
    if (oldUrl && isValidCloudinaryUrl(oldUrl)) {
      const oldPublicId = extractPublicId(oldUrl);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: "raw",
            invalidate: true,
          });
        } catch (destroyErr) {
          console.warn("[CV_DELETE] Could not destroy Cloudinary CV asset:", destroyErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      locale: cleanLocale,
      cvFiles: (updated as any)?.profile?.resume?.cvFiles ?? {},
    });
  } catch (err: any) {
    console.error("[CV_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

