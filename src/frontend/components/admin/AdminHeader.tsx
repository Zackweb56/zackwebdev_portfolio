"use client";

import React, { useState, useRef, useEffect } from "react";
import { RefreshCw, Menu, X, ShieldCheck, Globe, ChevronDown } from "lucide-react";
import { LanguageItem } from "@/shared/constants/languages";

interface AdminHeaderProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages?: LanguageItem[];
  activeSectionTitle?: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({
  currentLanguage,
  onLanguageChange,
  languages = [],
  activeSectionTitle = "SITE_CONTENT_MANAGER",
  isMobileMenuOpen = false,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLangs = languages.length
    ? languages.filter((l) => l.isActive)
    : [
        { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr" as const, isActive: true, isDefault: false, order: 1 },
        { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", direction: "ltr" as const, isActive: true, isDefault: true, order: 2 },
      ];

  const currentActiveLang =
    activeLangs.find((l) => l.code.toUpperCase() === currentLanguage.toUpperCase()) ||
    activeLangs[0] || {
      code: currentLanguage.toLowerCase(),
      name: currentLanguage,
      nativeName: currentLanguage,
      flag: "🌐",
      direction: "ltr",
      isActive: true,
      isDefault: false,
      order: 1,
    };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <header className="w-full h-14 border-b border-white/10 bg-[#050505] px-3 sm:px-6 flex items-center justify-between z-30 select-none sticky top-0 shrink-0">
      {/* ── Left: Mobile Hamburger & Brand ── */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Menu Toggle (Visible on mobile/tablet < 1024px) */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="lg:hidden flex items-center justify-center w-8 h-8 border border-white/15 bg-white/5 text-white/80 hover:text-[#FFAA00] hover:border-[#FFAA00]/50 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        {/* Live Indicator Beacon */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFAA00] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFAA00]" />
        </span>

        {/* Brand Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
              ADMIN_PANEL
            </span>
            <ShieldCheck className="w-3 h-3 text-[#FFAA00]/80 hidden sm:inline" />
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-white/40 uppercase truncate max-w-[120px] sm:max-w-none">
            SECURE CONNECTION
          </span>
        </div>
      </div>

      {/* ── Center: Breadcrumb / Telemetry (Hidden on small mobile) ── */}
      <div className="hidden md:flex items-center gap-2 font-mono text-xs truncate max-w-md">
        <span className="w-1.5 h-1.5 bg-[#FFAA00] rounded-xs shrink-0" />
        <span className="text-white font-semibold tracking-wider truncate">
          {activeSectionTitle}
        </span>
        <span className="text-white/30 text-[10px] tracking-wider ml-1 hidden lg:inline shrink-0">
          // MODE: EDIT
        </span>
      </div>

      {/* ── Right: Dynamic Language Switcher & Sync ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* If 4 or fewer languages, show pill bar. If > 4, show responsive dropdown */}
        {activeLangs.length <= 4 ? (
          <div className="flex items-center border border-white/15 bg-black/60 p-0.5 font-mono text-[10px]">
            {activeLangs.map((l) => {
              const isSelected = l.code.toUpperCase() === currentLanguage.toUpperCase();
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange(l.code.toUpperCase())}
                  className={`px-2 sm:px-2.5 py-1 font-bold transition-colors cursor-pointer text-[10px] sm:text-xs flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#FFAA00] text-[#050505]"
                      : "text-white/50 hover:text-white"
                  }`}
                  title={`${l.name} (${l.nativeName})`}
                >
                  <span className="text-xs">{l.flag}</span>
                  <span>{l.code.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="relative font-mono text-xs" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-white/15 bg-black/60 text-white font-bold text-xs hover:border-[#FFAA00] transition-colors cursor-pointer"
            >
              <span className="text-sm">{currentActiveLang.flag}</span>
              <span className="text-[#FFAA00]">{currentActiveLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-white/50" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#080808] border border-white/20 shadow-2xl z-50 py-1 font-mono text-xs divide-y divide-white/5">
                {activeLangs.map((l) => {
                  const isSelected = l.code.toUpperCase() === currentLanguage.toUpperCase();
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(l.code.toUpperCase());
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#FFAA00]/10 text-[#FFAA00] font-bold"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.code.toUpperCase()}</span>
                        <span className="text-[10px] text-white/40 truncate">({l.name})</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* System Synced Badge */}
        <div className="hidden sm:flex items-center gap-1.5 border border-white/10 bg-white/5 px-2 sm:px-2.5 py-1 font-mono text-[9px] sm:text-[10px] text-white/60">
          <RefreshCw className="w-2.5 h-2.5 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="hidden md:inline">SYSTEM_SYNCED</span>
          <span className="md:hidden">SYNCED</span>
        </div>
      </div>
    </header>
  );
}
