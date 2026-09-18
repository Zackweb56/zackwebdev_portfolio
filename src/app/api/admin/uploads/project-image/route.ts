import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { Project } from "@/backend/models/PortfolioContent";
import cloudinary, { isValidCloudinaryUrl } from "@/backend/lib/cloudinary";

/**
 * Extracts the Cloudinary public_id from a secure delivery URL.
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
 * POST /api/admin/uploads/project-image
 *
 * Validates a Cloudinary delivery URL for project thumbnails or gallery assets.
 * When replacing a thumbnail, destroys the old Cloudinary asset to free storage.
 * Optionally updates the Project document directly if projectId is provided.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { secureUrl, projectId, isThumbnail, alt, caption } = body;

    if (!secureUrl || typeof secureUrl !== "string") {
      return NextResponse.json({ error: "Missing secureUrl" }, { status: 400 });
    }

    if (!isValidCloudinaryUrl(secureUrl)) {
      return NextResponse.json(
        { error: "Invalid Cloudinary URL or untrusted origin" },
        { status: 400 }
      );
    }

    // If projectId is provided, update project in DB
    if (projectId && typeof projectId === "string") {
      await connectMongoose();
      const filter = {
        $or: [
          { _id: projectId.match(/^[0-9a-fA-F]{24}$/) ? projectId : null },
          { projectId },
        ],
      };

      if (isThumbnail) {
        // ── Destroy old thumbnail from Cloudinary ─────────────────────────────
        const existingProject = await Project.findOne(filter).lean() as any;
        const oldThumbnailSrc: string | undefined = existingProject?.thumbnailSrc;
        if (oldThumbnailSrc && isValidCloudinaryUrl(oldThumbnailSrc) && oldThumbnailSrc !== secureUrl) {
          const oldPublicId = extractPublicId(oldThumbnailSrc);
          if (oldPublicId) {
            try {
              await cloudinary.uploader.destroy(oldPublicId, {
                resource_type: "image",
                invalidate: true,
              });
            } catch (destroyErr) {
              console.warn("[PROJECT_IMAGE_UPLOAD] Could not destroy old thumbnail:", destroyErr);
            }
          }
        }
        await Project.findOneAndUpdate(filter, { $set: { thumbnailSrc: secureUrl } });
      } else {
        await Project.findOneAndUpdate(
          filter,
          {
            $push: {
              gallery: {
                src: secureUrl,
                alt: alt || {},
                caption: caption || {},
              },
            },
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      secureUrl,
    });
  } catch (err: any) {
    console.error("[PROJECT_IMAGE_UPLOAD_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

