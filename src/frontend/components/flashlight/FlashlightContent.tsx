"use client";

import React from "react";

interface FlashlightContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FlashlightContent
 *
 * Section Content Reveal Container.
 *
 * Visual Architecture:
 *   - Layer 1 (.flashlight-baseline): Interactive content at pitch-dark baseline opacity (~0.12).
 *   - Layer 2 (.flashlight-reveal-overlay): Visual overlay at 1.0 opacity, dynamically masked around
 *     pointer position using:
 *     radial-gradient(circle 420px at var(--mouse-x) var(--mouse-y), black 0%, black 18%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.18) 70%, transparent 100%)
 *
 * Visual Guarantee:
 *   - ZERO white/gray circle disk artifact on `#050505` background.
 *   - Only typography, borders, and section details illuminate softly under the cursor.
 *   - Global UI (Navigation, HUD, Scanlines, Noise, Cursor) remain 100% visible at all times.
 *   - Touch devices and reduced motion default to 100% full content readability.
 */
export function FlashlightContent({
  children,
  className = "",
}: FlashlightContentProps) {
  return (
    <div className={`flashlight-content-root relative w-full ${className}`}>
      {/* ── Layer 1: Interactive Content (Dark Baseline) ── */}
      <div className="flashlight-baseline w-full">{children}</div>

      {/* ── Layer 2: Visual Illumination Overlay (Full Contrast + Soft Pointer Mask) ── */}
      <div
        className="flashlight-reveal-overlay w-full absolute inset-0 pointer-events-none select-none z-[2]"
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
