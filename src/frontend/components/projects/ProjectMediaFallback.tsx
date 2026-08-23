"use client";

import React from "react";
import { MediaFallbackVariant } from "@/frontend/types/project";

interface ProjectMediaFallbackProps {
  title?: string;
  evidenceId?: string;
  category?: string;
  variant?: MediaFallbackVariant;
  className?: string;
}

/**
 * ProjectMediaFallback
 *
 * Premium technical HUD blueprint / wireframe placeholder rendered when a project
 * does not have an image asset or while media is loading.
 *
 * Characteristics:
 *   - Dark `#050505` baseline matching the global visual environment.
 *   - Fine technical vector geometry with `#FFAA00` accent reticles and coordinate stamps.
 *   - 4 variants: "schematic", "wireframe", "terminal", "grid".
 *   - Zero layout shift, responsive SVG viewBox.
 */
export function ProjectMediaFallback({
  title = "SYSTEM ARCHITECTURE",
  evidenceId = "EVIDENCE // ARCHIVE",
  category = "FULLSTACK",
  variant = "schematic",
  className = "",
}: ProjectMediaFallbackProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[220px] sm:min-h-[260px] bg-[#050505] border border-white/10 overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}
      aria-hidden="true"
    >
      {/* ── 4 Corner HUD Reticles ── */}
      <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#FFAA00]/80" />
      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#FFAA00]/80" />
      <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#FFAA00]/80" />
      <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#FFAA00]/80" />

      {/* ── Background Technical Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #FFAA00 1px, transparent 1px), linear-gradient(to bottom, #FFAA00 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Top Telemetry Header ── */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[0.6rem] tracking-widest text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] animate-pulse" />
          <span className="text-[#FFAA00] font-semibold">{evidenceId}</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 uppercase">
          <span>SYS.SCHEMATIC</span>
          <span>|</span>
          <span>{variant}</span>
        </div>
      </div>

      {/* ── Center Vector Architecture Schematic ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2">
        <svg
          viewBox="0 0 320 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[260px] text-white/20"
        >
          {variant === "schematic" && (
            <>
              {/* Node 1: Client Layer */}
              <rect x="20" y="35" width="60" height="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <text x="50" y="63" fill="#FFAA00" fontSize="8" fontFamily="monospace" textAnchor="middle">UI // CLIENT</text>

              {/* Connecting Bus */}
              <line x1="80" y1="60" x2="130" y2="60" stroke="#FFAA00" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="105" cy="60" r="3" fill="#FFAA00" />

              {/* Node 2: Core Engine */}
              <rect x="130" y="25" width="70" height="70" stroke="currentColor" strokeWidth="1.2" />
              <rect x="135" y="30" width="60" height="60" stroke="#FFAA00" strokeWidth="0.8" strokeOpacity="0.5" />
              <text x="165" y="63" fill="white" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ENGINE</text>

              {/* Connecting Bus */}
              <line x1="200" y1="60" x2="250" y2="60" stroke="#FFAA00" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="225" cy="60" r="3" fill="#FFAA00" />

              {/* Node 3: Storage */}
              <rect x="250" y="35" width="55" height="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <text x="277" y="63" fill="#FFAA00" fontSize="8" fontFamily="monospace" textAnchor="middle">DB_STORE</text>
            </>
          )}

          {variant === "terminal" && (
            <>
              <rect x="10" y="10" width="300" height="100" stroke="currentColor" strokeWidth="1" />
              <line x1="10" y1="28" x2="310" y2="28" stroke="currentColor" strokeWidth="1" />
              <circle cx="24" cy="19" r="2.5" fill="#FFAA00" />
              <circle cx="34" cy="19" r="2.5" fill="currentColor" />
              <circle cx="44" cy="19" r="2.5" fill="currentColor" />
              <text x="24" y="52" fill="#FFAA00" fontSize="9" fontFamily="monospace">&gt; RUN_DIAGNOSTIC --system</text>
              <text x="24" y="70" fill="white" fontSize="8" fontFamily="monospace" opacity="0.6">[OK] MODULE_DISPATCH_READY</text>
              <text x="24" y="86" fill="white" fontSize="8" fontFamily="monospace" opacity="0.4">[OK] CLOUD_DATABASE_ONLINE</text>
            </>
          )}

          {variant === "grid" && (
            <>
              <circle cx="160" cy="60" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="160" cy="60" r="28" stroke="#FFAA00" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="160" cy="60" r="4" fill="#FFAA00" />
              <line x1="100" y1="60" x2="220" y2="60" stroke="currentColor" strokeWidth="0.8" />
              <line x1="160" y1="10" x2="160" y2="110" stroke="currentColor" strokeWidth="0.8" />
              <text x="160" y="116" fill="#FFAA00" fontSize="8" fontFamily="monospace" textAnchor="middle">DATA_MATRIX_ACTIVE</text>
            </>
          )}

          {variant === "wireframe" && (
            <>
              <polygon points="160,15 260,65 160,105 60,65" stroke="#FFAA00" strokeWidth="1" fill="none" strokeOpacity="0.8" />
              <line x1="60" y1="65" x2="160" y2="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="260" y1="65" x2="160" y2="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="160" y1="15" x2="160" y2="105" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="160" cy="60" r="3" fill="#FFAA00" />
              <text x="160" y="80" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.7">TOPOLOGY_MAP</text>
            </>
          )}
        </svg>

        <span className="font-mono text-[0.65rem] text-white/50 tracking-wider uppercase mt-1">
          {title}
        </span>
      </div>

      {/* ── Bottom Telemetry Footer ── */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[0.58rem] text-white/40">
        <span className="text-[#FFAA00]">TYPE: {category}</span>
        <span className="tracking-widest">STATUS: SPEC_VERIFIED</span>
      </div>
    </div>
  );
}
