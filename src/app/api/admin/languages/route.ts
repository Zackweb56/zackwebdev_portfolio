import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { Language } from "@/backend/models/Language";
import { getAllLanguages } from "@/backend/dal/languages";

const CreateLanguageSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[a-z]{2,5}(-[a-zA-Z]{2,4})?$/, "Invalid language code format (e.g. 'en', 'fr', 'es-mx')")
    .transform((v) => v.toLowerCase().trim()),
  name: z.string().min(1).max(50).trim(),
  nativeName: z.string().min(1).max(50).trim(),
  flag: z.string().min(1).max(20).trim(),
  direction: z.enum(["ltr", "rtl"]).default("ltr"),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

/**
 * GET /api/admin/languages
 * Returns all configured languages (active and inactive) for admin management.
 */
export async function GET() {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const languages = await getAllLanguages();
    return NextResponse.json({ languages });
  } catch (err: any) {
    console.error("[API_ADMIN_LANGUAGES_GET_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/languages
 * Add a new language or enable an existing one.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const body = await req.json();
    const parsed = CreateLanguageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if code already exists
    const existing = await Language.findOne({ code: data.code });
    if (existing) {
      // Re-enable and update existing
      if (data.isDefault) {
        await Language.updateMany({ _id: { $ne: existing._id } }, { isDefault: false });
      }
      existing.name = data.name;
      existing.nativeName = data.nativeName;
      existing.flag = data.flag;
      existing.direction = data.direction;
      existing.isActive = data.isActive;
      if (data.isDefault) existing.isDefault = true;
      if (data.order) existing.order = data.order;
      await existing.save();

      return NextResponse.json({ success: true, language: existing });
    }

    // If new language is marked default, unset all others
    if (data.isDefault) {
      await Language.updateMany({}, { isDefault: false });
    }

    // Determine order if not explicitly specified
    if (!data.order) {
      const maxOrderDoc = await Language.findOne({}).sort({ order: -1 }).lean();
      data.order = (maxOrderDoc?.order ?? 0) + 1;
    }

    const newLang = await Language.create(data);
    return NextResponse.json({ success: true, language: newLang }, { status: 201 });
  } catch (err: any) {
    console.error("[API_ADMIN_LANGUAGES_POST_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
