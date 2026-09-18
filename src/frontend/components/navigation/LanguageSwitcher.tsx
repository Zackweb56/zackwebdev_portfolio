"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { LanguageItem } from "@/shared/constants/languages";
import { playSound } from "@/frontend/lib/sound";

interface LanguageSwitcherProps {
  currentLocale?: string;
  activeLanguages?: LanguageItem[];
  compact?: boolean;
}

export function LanguageSwitcher({
  currentLocale = "en",
  activeLanguages = [],
  compact = false,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [languages, setLanguages] = useState<LanguageItem[]>(activeLanguages);
  const [currentLang, setCurrentLang] = useState<string>(currentLocale);

  // If languages not passed or empty, fetch active languages client-side
  useEffect(() => {
    if (!languages.length) {
      fetch("/api/languages")
        .then((res) => res.json())
        .then((data) => {
          if (data?.languages?.length) {
            setLanguages(data.languages);
          }
        })
        .catch(() => {
          // Fallback static
          setLanguages([
            { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", direction: "ltr", isActive: true, isDefault: true, order: 1 },
            { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr", isActive: true, isDefault: false, order: 2 },
          ]);
        });
    }
  }, [languages.length]);

  // Read current language from searchParams or cookie or prop
  useEffect(() => {
    const urlLang = searchParams?.get("lang");
    if (urlLang) {
      setCurrentLang(urlLang.toLowerCase());
    } else {
      const match = document.cookie.match(/(?:^|;\s*)portfolio_lang=([^;]*)/);
      if (match && match[1]) {
        setCurrentLang(match[1].toLowerCase());
      } else if (currentLocale) {
        setCurrentLang(currentLocale.toLowerCase());
      }
    }
  }, [searchParams, currentLocale]);

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeLangList = languages.filter((l) => l.isActive);
  const currentItem =
    activeLangList.find((l) => l.code.toLowerCase() === currentLang.toLowerCase()) ||
    activeLangList[0] || {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇬🇧",
      direction: "ltr",
      isActive: true,
      isDefault: true,
      order: 1,
    };

  const handleSelectLanguage = (targetCode: string) => {
    const cleanCode = targetCode.toLowerCase();
    setIsOpen(false);

    if (cleanCode === currentLang.toLowerCase()) {
      return;
    }

    try {
      playSound("click");
    } catch {
      // Audio optional
    }

    // 1. Set persistent cookie for 1 year
    document.cookie = `portfolio_lang=${cleanCode}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLang(cleanCode);

    // 2. Dispatch event to trigger the IntroLoader re-boot / recalibration sequence
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio:reboot-loader", {
          detail: {
            lang: cleanCode,
            flag: languages.find((l) => l.code === cleanCode)?.flag || "🌐",
            name: languages.find((l) => l.code === cleanCode)?.nativeName || cleanCode.toUpperCase(),
          },
        })
      );
    }

    // 3. Update route and refresh page data smoothly
    setTimeout(() => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("lang", cleanCode);
      router.push(currentUrl.pathname + currentUrl.search, { scroll: false });
      router.refresh();
    }, 400);
  };

  return (
    <div className="relative font-mono select-none" ref={dropdownRef}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => {
          try {
            playSound("hover");
          } catch {}
          setIsOpen(!isOpen)}
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Select language. Current: ${currentItem.name}`}
        className={`group relative flex items-center gap-1.5 font-mono tracking-wider transition-all duration-200 border rounded-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAA00] focus-visible:outline-offset-2 cursor-pointer ${
          compact
            ? "px-2 py-1 text-[0.7rem] bg-black/60 border-white/15 hover:border-[#FFAA00]/60 text-white/80"
            : "px-2.5 py-1.5 text-xs bg-black/40 hover:bg-black/80 border-white/15 hover:border-[#FFAA00]/50 text-white/90"
        } ${isOpen ? "border-[#FFAA00] bg-black/80 text-[#FFAA00]" : ""}`}
      >
        <Globe
          className={`w-3.5 h-3.5 transition-colors duration-200 ${
            isOpen ? "text-[#FFAA00]" : "text-white/50 group-hover:text-[#FFAA00]"
          }`}
        />
        <span className="text-sm select-none" role="img" aria-hidden="true">
          {currentItem.flag}
        </span>
        <span className="font-bold text-[0.7rem] tracking-[0.1em] text-white/90 group-hover:text-white">
          {currentItem.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-white/40 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#FFAA00]" : "group-hover:text-white"
          }`}
        />
      </button>

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-48 bg-[#050505]/95 backdrop-blur-md border border-white/15 rounded-xs shadow-2xl py-1 z-[var(--z-navigation)] divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-150"
          style={{
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 15px rgba(255,170,0,0.1)",
          }}
        >
          <div className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-[#FFAA00]/80 flex items-center justify-between">
            <span>SELECT LOCALE</span>
            <span className="text-[8px] text-white/30">[I18N]</span>
          </div>

          <div className="py-1">
            {activeLangList.map((lang) => {
              const isSelected = lang.code.toLowerCase() === currentLang.toLowerCase();
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left font-mono text-xs transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-[#FFAA00]/10 text-[#FFAA00] font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none" role="img" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{lang.code.toUpperCase()}</span>
                        <span className="text-[10px] text-white/40 truncate">
                          {lang.nativeName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#FFAA00] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 font-mono text-[8px] text-white/30 text-center tracking-wider uppercase">
            LIVE REBOOT ON SWITCH
          </div>
        </div>
      )}
    </div>
  );
}
