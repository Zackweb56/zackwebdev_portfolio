import connectMongoose from "@/backend/db/mongoose";
import { Language } from "@/backend/models/Language";
import { DEFAULT_TOP_LANGUAGES, LanguageItem } from "@/shared/constants/languages";

/**
 * Ensure default languages are initialized in the MongoDB cluster
 */
export async function ensureDefaultLanguages(): Promise<void> {
  await connectMongoose();
  const count = await Language.countDocuments();
  if (count === 0) {
    const toInsert = DEFAULT_TOP_LANGUAGES.map((lang, index) => ({
      ...lang,
      order: index + 1,
    }));
    await Language.insertMany(toInsert);
  }
}

/**
 * Get all languages (active and inactive) for the Admin Dashboard
 */
export async function getAllLanguages(): Promise<LanguageItem[]> {
  await connectMongoose();
  await ensureDefaultLanguages();
  const docs = await Language.find({}).sort({ order: 1, code: 1 }).lean();
  return docs.map((d: any) => ({
    code: d.code,
    name: d.name,
    nativeName: d.nativeName,
    flag: d.flag,
    direction: d.direction || "ltr",
    isActive: Boolean(d.isActive),
    isDefault: Boolean(d.isDefault),
    order: d.order ?? 0,
  }));
}

/**
 * Get active languages for Public Portfolio & Header Switcher
 */
export async function getActiveLanguages(): Promise<LanguageItem[]> {
  await connectMongoose();
  await ensureDefaultLanguages();
  const docs = await Language.find({ isActive: true }).sort({ order: 1, code: 1 }).lean();
  if (!docs.length) {
    // Fallback safe return
    return [
      {
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇬🇧",
        direction: "ltr",
        isActive: true,
        isDefault: true,
        order: 1,
      },
      {
        code: "fr",
        name: "French",
        nativeName: "Français",
        flag: "🇫🇷",
        direction: "ltr",
        isActive: true,
        isDefault: false,
        order: 2,
      },
    ];
  }
  return docs.map((d: any) => ({
    code: d.code,
    name: d.name,
    nativeName: d.nativeName,
    flag: d.flag,
    direction: d.direction || "ltr",
    isActive: Boolean(d.isActive),
    isDefault: Boolean(d.isDefault),
    order: d.order ?? 0,
  }));
}

/**
 * Get the current default language code
 */
export async function getDefaultLanguageCode(): Promise<string> {
  await connectMongoose();
  const def = await Language.findOne({ isDefault: true, isActive: true }).lean();
  if (def?.code) return def.code;
  const firstActive = await Language.findOne({ isActive: true }).sort({ order: 1 }).lean();
  return firstActive?.code || "en";
}
