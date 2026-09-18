import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { Language } from "@/backend/models/Language";

const UpdateLanguageSchema = z.object({
  name: z.string().min(1).max(50).trim().optional(),
  nativeName: z.string().min(1).max(50).trim().optional(),
  flag: z.string().min(1).max(20).trim().optional(),
  direction: z.enum(["ltr", "rtl"]).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

/**
 * PATCH /api/admin/languages/[code]
 * Update a language's status, default state, or metadata.
 */
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await props.params;
    const cleanCode = code?.toLowerCase()?.trim();

    if (!cleanCode) {
      return NextResponse.json({ error: "Language code is required" }, { status: 400 });
    }

    await connectMongoose();
    const body = await req.json();
    const parsed = UpdateLanguageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const targetLang = await Language.findOne({ code: cleanCode });
    if (!targetLang) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }

    const updates = parsed.data;

    // Guard: Do not allow deactivating the default language
    if (updates.isActive === false && targetLang.isDefault) {
      return NextResponse.json(
        { error: "Cannot deactivate the default language. Set another language as default first." },
        { status: 400 }
      );
    }

    // Guard: Ensure at least one language remains active
    if (updates.isActive === false) {
      const activeCount = await Language.countDocuments({ isActive: true });
      if (activeCount <= 1) {
        return NextResponse.json(
          { error: "At least one active language is required." },
          { status: 400 }
        );
      }
    }

    // If setting as default, ensure it is active and unset all others
    if (updates.isDefault === true) {
      updates.isActive = true;
      await Language.updateMany({ _id: { $ne: targetLang._id } }, { isDefault: false });
    }

    Object.assign(targetLang, updates);
    await targetLang.save();

    return NextResponse.json({ success: true, language: targetLang });
  } catch (err: any) {
    console.error("[API_ADMIN_LANGUAGE_PATCH_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/languages/[code]
 * Delete custom language (cannot delete default language).
 */
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await props.params;
    const cleanCode = code?.toLowerCase()?.trim();

    if (!cleanCode) {
      return NextResponse.json({ error: "Language code is required" }, { status: 400 });
    }

    await connectMongoose();
    const targetLang = await Language.findOne({ code: cleanCode });
    if (!targetLang) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }

    if (targetLang.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete the default language. Assign a new default first." },
        { status: 400 }
      );
    }

    const activeCount = await Language.countDocuments({ isActive: true });
    if (targetLang.isActive && activeCount <= 1) {
      return NextResponse.json(
        { error: "At least one active language is required." },
        { status: 400 }
      );
    }

    await Language.deleteOne({ _id: targetLang._id });
    return NextResponse.json({ success: true, deletedCode: cleanCode });
  } catch (err: any) {
    console.error("[API_ADMIN_LANGUAGE_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
