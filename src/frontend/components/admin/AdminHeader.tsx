"use client";

import React from "react";
import { RefreshCw, Menu, X, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  currentLanguage: "FR" | "EN";
  onLanguageChange: (lang: "FR" | "EN") => void;
  activeSectionTitle?: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({
  currentLanguage,
  onLanguageChange,
  activeSectionTitle = "SITE_CONTENT_MANAGER",
  isMobileMenuOpen = false,
  onToggleMobileMenu,
}: AdminHeaderProps) {
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

      {/* ── Right: Language Switcher & Sync ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <div className="flex items-center border border-white/15 bg-black/60 p-0.5 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => onLanguageChange("FR")}
            className={`px-2 sm:px-2.5 py-1 font-bold transition-colors cursor-pointer text-[10px] sm:text-xs ${
              currentLanguage === "FR"
                ? "bg-[#FFAA00] text-[#050505]"
                : "text-white/50 hover:text-white"
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("EN")}
            className={`px-2 sm:px-2.5 py-1 font-bold transition-colors cursor-pointer text-[10px] sm:text-xs ${
              currentLanguage === "EN"
                ? "bg-[#FFAA00] text-[#050505]"
                : "text-white/50 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>

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
