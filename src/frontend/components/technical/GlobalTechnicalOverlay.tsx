"use client";

import React, { useEffect, useState } from "react";
import { TechnicalStatus } from "./TechnicalStatus";

/**
 * GlobalTechnicalOverlay
 *
 * A fixed, non-interactive viewport overlay that renders persistent
 * system-level metadata in all four corners of the screen.
 *
 * Architecture:
 *   - Fixed positioning (covers full viewport, follows scroll)
 *   - pointer-events: none (never blocks interaction)
 *   - z-index: var(--z-overlays) = 70 (above content, below cursor/modal)
 *   - Responsive: desktop shows full metadata, mobile shows minimal
 *   - Lives inside the PublicLayoutShell global UI layer
 *
 * Corner Layout:
 *   TOP-LEFT:    System ID + CAM Feed tag
 *   TOP-RIGHT:   Case file identifier + status
 *   BOTTOM-LEFT: Live feed status + system mode
 *   BOTTOM-RIGHT: System diagnostic + stability
 */
export function GlobalTechnicalOverlay() {
  const [time, setTime] = useState<string>("");

  // Live system clock — lightweight, cleans up on unmount
  useEffect(() => {
    const format = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds().toString().padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    setTime(format());
    const interval = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[var(--z-overlays)]"
      aria-hidden="true"
    >
      {/* ── TOP LEFT: System Identity ── */}
      <div className="absolute top-16 left-4 sm:left-6 flex flex-col gap-1 hidden sm:flex">
        <span className="font-mono text-[0.6rem] tracking-[0.18em] text-white/25 uppercase">
          SYS_ID // ZB-2026
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-[#FFAA00]/50 uppercase">
          CAM_01 // ACTIVE
        </span>
      </div>

      {/* ── TOP RIGHT: Case File ── */}
      <div className="absolute top-16 right-4 sm:right-6 flex flex-col items-end gap-1 hidden sm:flex">
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-white/25 uppercase">
          PORTFOLIO // CASE FILE
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-[#FFAA00]/60 uppercase font-semibold">
          ZB-FULLSTACK-2026
        </span>
      </div>

      {/* ── BOTTOM LEFT: Live Feed Status ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex flex-col gap-1.5">
        <TechnicalStatus label="LIVE_FEED" variant="amber" pulse />
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-white/25 uppercase hidden sm:block">
          MONITORING // ACTIVE
        </span>
      </div>

      {/* ── BOTTOM RIGHT: System Diagnostic ── */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col items-end gap-1.5">
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-[#FFAA00]/40 tabular-nums hidden md:block">
          {time}
        </span>
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-white/25 uppercase hidden sm:block">
          SYS.DIAGNOSTIC
        </span>
        <TechnicalStatus label="STABLE" variant="muted" pulse={false} />
      </div>
    </div>
  );
}
