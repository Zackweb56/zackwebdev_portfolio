import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import cloudinary from "@/backend/lib/cloudinary";

/**
 * DELETE /api/cloudinary/delete
 *
 * Destroys a Cloudinary asset by its public_id.
 * Used when an admin replaces or removes a profile image, CV, or project image,
 * so that orphaned assets are purged from the free-plan storage quota.
 *
 * Body: { publicId: string; resourceType?: "image" | "video" | "raw" }
 * Default resourceType is "image"; CVs (PDF/DOCX) should use "raw".
 */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { publicId, resourceType = "image" } = body;

    if (!publicId || typeof publicId !== "string" || !publicId.trim()) {
      return NextResponse.json({ error: "Missing or invalid publicId" }, { status: 400 });
    }

    // Validate resourceType to prevent injection
    const allowedTypes = ["image", "video", "raw"] as const;
    type ResourceType = (typeof allowedTypes)[number];
    if (!allowedTypes.includes(resourceType as ResourceType)) {
      return NextResponse.json(
        { error: `Invalid resourceType. Allowed: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId.trim(), {
      resource_type: resourceType as ResourceType,
      invalidate: true,
    });

    // Cloudinary returns { result: "ok" } on success or { result: "not found" } if already gone
    return NextResponse.json({ success: true, result: result.result });
  } catch (err: any) {
    console.error("[CLOUDINARY_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
