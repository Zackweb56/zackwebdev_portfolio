"use client";

import React from "react";
import { SocialIcons } from "@/frontend/components/ui/SocialIcons";
import { playSound } from "@/frontend/lib/sound";

export function Footer() {
  const scrollToTop = () => {
    playSound("click");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative w-full border-t border-white/10 bg-[#050505] text-white select-none z-[var(--z-content)]"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* ── Brand & Copyright ── */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-mono text-[0.68rem] text-white/40 tracking-wider">
          <span className="text-white/80 font-bold tracking-widest uppercase">
            ZACKWEBDEV
          </span>
          <span className="hidden sm:inline text-white/20">/</span>
          <span>© 2026 ZAKARIYAE BOUGHABA</span>
        </div>

        {/* ── Status & Location (No Lat/Long) ── */}
        <div className="flex items-center gap-3 font-mono text-[0.625rem] text-white/40 tracking-widest uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#44FF88] animate-pulse" />
            <span className="text-white/60">AVAILABLE FOR WORK</span>
          </div>
          <span className="opacity-30">·</span>
          <span>BÉNI MELLAL, MOROCCO</span>
        </div>

        {/* ── Social Icons & Back To Top ── */}
        <div className="flex items-center gap-4">
          <SocialIcons size="sm" />

          <button
            type="button"
            onClick={scrollToTop}
            onMouseEnter={() => playSound("hover")}
            className="flex items-center gap-1 font-mono text-[0.65rem] tracking-widest text-white/40 hover:text-[#FFAA00] border border-white/10 hover:border-[#FFAA00]/50 px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer bg-white/[0.02] hover:bg-[#FFAA00]/5"
            aria-label="Back to top of page"
            title="Back to top"
          >
            <span>↑</span>
            <span>TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
