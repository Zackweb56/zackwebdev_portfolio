export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
  isActive: boolean;
  isDefault: boolean;
  order: number;
}

/**
 * Default Top Preset Languages
 * Easily activated with 1-click in the Admin Dashboard
 */
export const DEFAULT_TOP_LANGUAGES: Omit<LanguageItem, "order">[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    direction: "ltr",
    isActive: true,
    isDefault: true,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    direction: "ltr",
    isActive: true,
    isDefault: false,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    direction: "ltr",
    isActive: false,
    isDefault: false,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    direction: "ltr",
    isActive: false,
    isDefault: false,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    direction: "ltr",
    isActive: false,
    isDefault: false,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇲🇦",
    direction: "rtl",
    isActive: false,
    isDefault: false,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    direction: "ltr",
    isActive: false,
    isDefault: false,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    direction: "ltr",
    isActive: false,
    isDefault: false,
  },
];
