"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  TechnicalFrame,
  TechnicalStatus,
  TechnicalLabel,
  TechnicalDivider,
} from "@/frontend/components/technical";

/**
 * IntroLoader
 *
 * Cinematic Developer System Initialization Sequence with premium GSAP animations.
 *
 * Visual concept:
 *   SYSTEM BOOT → SYSTEM READY → INTERFACE UNLOCK → PORTFOLIO REVEAL
 *
 * Signature moment — "The Crack-Open":
 *   When SYSTEM READY is confirmed, the loader's solid dark shell physically splits
 *   at the viewport's horizontal midpoint. The top panel slides up, the bottom panel
 *   slides down, revealing the portfolio underneath — as if a sealed system case
 *   is being opened. A thin #FFAA00 seam line activates at the split boundary
 *   before the panels depart.
 *
 * Timeline (target ~5.5–6s total):
 *   0.00s  — header metadata appears
 *   0.60s  — scanline + system frame entrance
 *   1.20s  — brief glitch flash
 *   1.40s  — boot stages stagger in
 *   2.40s  — progress bar fills (1.2s)
 *   3.00s  — SYSTEM READY emerges
 *   3.50s  — brief stabilization pulse
 *   4.00s  — hold at SYSTEM READY
 *   4.20s  — crack-open begins (content fades, seam appears)
 *   4.60s  — panels depart, portfolio revealed
 *   ~5.50s — finish() fires, component unmounts
 *
 * Technical details:
 *   - No session/local storage
 *   - GSAP timeline killed on cleanup via gsap.context().revert()
 *   - Body scroll locked during boot, released on completion or unmount
 *   - html.is-booting class suppresses flashlight until boot completes
 *   - Two solid #050505 panels (top/bottom) act as the loader background shell.
 *     They provide the dark background during boot and animate away during exit.
 *     The container itself has no background, ensuring a clean reveal with no
 *     blank screen between loader and portfolio.
 */
export function IntroLoader() {
  const [isComplete, setIsComplete] = useState(false);

  // ─── CONTENT REFS ──────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stage0 = useRef<HTMLDivElement>(null);
  const stage1 = useRef<HTMLDivElement>(null);
  const stage2 = useRef<HTMLDivElement>(null);
  const stage3 = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressWrapperRef = useRef<HTMLDivElement>(null);
  const statusReadyRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  // ─── CRACK-OPEN EXIT REFS ──────────────────────────────────────────────────
  // The two solid panels that form the loader shell during boot.
  // These slide apart to reveal the portfolio underneath.
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  // Amber seam line that briefly activates at the split point.
  const splitLineRef = useRef<HTMLDivElement>(null);

  // Mount: lock scroll + suppress flashlight
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("is-booting");

    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("is-booting");
    };
  }, []);

  // Run GSAP timeline
  useEffect(() => {
    if (isComplete) return;
    if (!containerRef.current) return;

    // Dynamically import gsap to guarantee browser context
    import("@/frontend/animations/gsap").then(({ gsap }) => {
      const container = containerRef.current;
      const header = headerRef.current;
      const frame = frameRef.current;
      const stages = [
        stage0.current,
        stage1.current,
        stage2.current,
        stage3.current,
      ].filter(Boolean) as HTMLElement[];
      const progressLine = progressLineRef.current;
      const progressText = progressTextRef.current;
      const progressWrapper = progressWrapperRef.current;
      const statusReady = statusReadyRef.current;
      const scanline = scanlineRef.current;
      const glitch = glitchRef.current;
      const topPanel = topPanelRef.current;
      const bottomPanel = bottomPanelRef.current;
      const splitLine = splitLineRef.current;

      if (!container) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const ctx = gsap.context(() => {
        if (reducedMotion) {
          // Instant completion for reduced-motion users
          gsap.to(container, {
            opacity: 0,
            duration: 0.15,
            delay: 0.1,
            ease: "power2.out",
            onComplete: finish,
          });
          return;
        }

        // ─── PRE-ANIMATION STATE SETUP ────────────────────────────────────────

        // Header: start hidden with blur
        if (header) gsap.set(header, { opacity: 0, y: -8, filter: "blur(3px)" });

        // Frame: start scaled down with blur
        if (frame) gsap.set(frame, { opacity: 0, scale: 0.96, filter: "blur(5px)" });

        // Stages: start hidden with upward offset
        if (stages.length)
          gsap.set(stages, { opacity: 0, y: 5, filter: "blur(2px)" });

        // Status: start hidden with scale
        if (statusReady)
          gsap.set(statusReady, { opacity: 0, scale: 0.92, filter: "blur(2px)" });

        // Progress: start at 0%
        if (progressLine) gsap.set(progressLine, { width: "0%" });

        // Scanline: start hidden, positioned at top
        if (scanline) gsap.set(scanline, { opacity: 0, y: "-100%" });

        // Glitch: start hidden
        if (glitch) gsap.set(glitch, { opacity: 0 });

        // ── CRACK-OPEN PANEL SETUP ───────────────────────────────────────────
        // Panels start in position (fully covering screen, forming the dark shell).
        // transformOrigin set for clean y slide without any rotation artifacts.
        if (topPanel) gsap.set(topPanel, { y: "0%", transformOrigin: "top center" });
        if (bottomPanel)
          gsap.set(bottomPanel, { y: "0%", transformOrigin: "bottom center" });

        // Split seam line: hidden and collapsed at center
        if (splitLine)
          gsap.set(splitLine, {
            opacity: 0,
            scaleX: 0,
            transformOrigin: "center center",
          });

        const counter = { value: 0 };

        const tl = gsap.timeline({ onComplete: finish });

        // ─── PHASE 1: HEADER METADATA (0.6s) ────────────────────────────────
        // ZB. identifier and ENV label materialize from above.
        if (header) {
          tl.to(header, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power3.out",
          });
        }

        // ─── PHASE 2: SCANLINE + SYSTEM FRAME ENTRANCE ───────────────────────
        // Scanline and frame appear together. Frame has a slight scale-in.
        if (scanline) {
          tl.to(
            scanline,
            {
              opacity: 0.06,
              duration: 0.4,
              ease: "power2.out",
            },
            "+=0.15"
          );
        }

        if (frame) {
          tl.to(
            frame,
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power4.out",
            },
            "<" // starts simultaneously with scanline
          );
        }

        // ─── PHASE 3: GLITCH FLASH (brief system acknowledgment) ─────────────
        if (glitch) {
          tl.to(
            glitch,
            {
              opacity: 0.04,
              duration: 0.1,
              ease: "power1.out",
            },
            "+=0.15"
          );

          tl.to(glitch, {
            opacity: 0,
            duration: 0.2,
            ease: "power1.inOut",
          });
        }

        // ─── PHASE 4: STAGGERED BOOT STAGES (4 stages, 1.0s total) ─────────
        // Each stage confirms its sub-system status.
        if (stages.length) {
          tl.to(
            stages,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.18,
              duration: 0.45,
              ease: "power2.out",
            },
            "-=0.15"
          );
        }

        // ─── PHASE 5: PROGRESS BAR + COUNTER (1.2s) ──────────────────────────
        if (progressLine) {
          tl.to(
            progressLine,
            {
              width: "100%",
              duration: 1.2,
              ease: "power2.inOut",
            },
            "+=0.2"
          );
        }

        if (progressText) {
          tl.to(
            counter,
            {
              value: 100,
              duration: 1.2,
              ease: "power2.inOut",
              onUpdate: () => {
                if (progressTextRef.current) {
                  progressTextRef.current.textContent = `${Math.floor(counter.value)
                    .toString()
                    .padStart(3, "0")}%`;
                }
              },
            },
            "<" // starts simultaneously with progress bar
          );
        }

        // ─── PHASE 6: SYSTEM READY CLIMAX ────────────────────────────────────
        // SYSTEM READY emerges during the final progress fill.
        if (statusReady) {
          tl.to(
            statusReady,
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.4"
          );

          // Brief stabilization pulse — the system confirming its state.
          tl.to(
            statusReady,
            {
              scale: 1.014,
              duration: 0.18,
              ease: "sine.inOut",
              yoyo: true,
              repeat: 1,
            },
            "+=0.1"
          );
        }

        // ─── PHASE 7: SCANLINE RETREAT ────────────────────────────────────────
        if (scanline) {
          tl.to(
            scanline,
            {
              y: "100%",
              opacity: 0,
              duration: 0.35,
              ease: "power2.inOut",
            },
            "-=0.15"
          );
        }

        // ─── PHASE 8: HOLD — LET SYSTEM READY REGISTER ───────────────────────
        tl.to({}, { duration: 0.4 });

        // ─── PHASE 9: CRACK-OPEN SPLIT REVEAL ────────────────────────────────
        //
        // The signature unlock sequence:
        //
        //   1. UI content fades — the system shell takes over
        //   2. The amber seam activates at the horizontal midpoint
        //   3. Top and bottom panels slide apart, tearing the shell open
        //   4. The portfolio is revealed beneath — it was always there
        //
        // No blank screen. No generic fade. A physical interface opening.

        // Step 1: Fade out all UI content simultaneously.
        // The solid #050505 panels remain visible — the "shell" stays intact
        // until the crack begins.
        const contentToFade = [header, frame, progressWrapper].filter(
          Boolean
        ) as HTMLElement[];

        if (contentToFade.length) {
          tl.to(
            contentToFade,
            {
              opacity: 0,
              duration: 0.35,
              ease: "power2.in",
            },
            "+=0.1"
          );
        }

        // Step 2: The amber seam line ignites at the split boundary.
        // Expands from center outward — the crack appears.
        if (splitLine) {
          tl.to(
            splitLine,
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.25,
              ease: "power3.out",
            },
            "-=0.2" // overlaps with content fade — seam appears as content disappears
          );
        }

        // Step 3: THE CRACK-OPEN — panels depart simultaneously.
        // power4.out: immediate force, smooth deceleration as panels clear the viewport.
        if (topPanel) {
          tl.to(
            topPanel,
            {
              y: "-102%",
              duration: 0.7,
              ease: "power4.out",
            },
            "+=0.1"
          );
        }

        if (bottomPanel) {
          tl.to(
            bottomPanel,
            {
              y: "102%",
              duration: 0.7,
              ease: "power4.out",
            },
            "<" // perfectly synchronized with top panel
          );
        }

        // Step 4: Seam line fades as the gap between panels widens.
        // The portfolio takes over — no overlay remains.
        if (splitLine) {
          tl.to(
            splitLine,
            {
              opacity: 0,
              duration: 0.35,
              ease: "power2.out",
            },
            "<+=0.2" // begins fading shortly after panels start moving
          );
        }
      }, container);

      // Cleanup: kill timeline if component unmounts before completion
      return () => ctx.revert();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  function finish() {
    document.body.style.overflow = "";
    document.documentElement.classList.remove("is-booting");
    // Signal the Hero to begin its entrance timeline.
    // Hero.tsx listens for this event with { once: true }.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero:ready"));
    }
    setIsComplete(true);
  }

  // Don't render anything after completion
  if (isComplete) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      /*
       * No background color on the container itself.
       * The two solid panels (topPanel / bottomPanel) form the dark shell during boot.
       * When they slide away, the portfolio is immediately visible underneath —
       * no blank-screen gap, no flash.
       */
      className="fixed inset-0 z-[var(--z-modal)] flex flex-col justify-between p-6 sm:p-10 text-white select-none overflow-hidden"
      aria-label="System initialization"
      role="status"
      aria-live="polite"
    >
      {/* Screen reader announcement */}
      <span className="sr-only">Loading Zakariyae Boughaba Portfolio System</span>

      {/* ── TOP PANEL — Upper half of the loader shell ── */}
      {/*
       * Absolutely positioned, covers the top 50% of the container.
       * 1px extra height ensures no sub-pixel gap at the seam.
       * Sits at z-index 1 (below content at z-index 10).
       * During the crack-open, slides to y: -102% — fully off-screen above.
       */}
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 w-full pointer-events-none bg-[#050505]"
        style={{ height: "calc(50% + 1px)", zIndex: 1 }}
        aria-hidden="true"
      />

      {/* ── BOTTOM PANEL — Lower half of the loader shell ── */}
      {/*
       * Covers the bottom 50% of the container.
       * During the crack-open, slides to y: +102% — fully off-screen below.
       */}
      <div
        ref={bottomPanelRef}
        className="absolute bottom-0 left-0 w-full pointer-events-none bg-[#050505]"
        style={{ height: "calc(50% + 1px)", zIndex: 1 }}
        aria-hidden="true"
      />

      {/* ── SPLIT SEAM LINE — The amber crack that precedes the panel separation ── */}
      {/*
       * A 1px horizontal line at the exact vertical midpoint.
       * Starts collapsed (scaleX: 0) and expands from center outward.
       * Sits at z-index 5 — above panels, visible when content is faded.
       * Fades as the panels accelerate away.
       *
       * Positioned via top + marginTop (no CSS transform) to avoid
       * GSAP transform conflicts when scaleX is animated.
       */}
      <div
        ref={splitLineRef}
        className="absolute left-0 w-full pointer-events-none"
        style={{
          top: "50%",
          marginTop: "-0.5px",
          height: "1px",
          zIndex: 5,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,170,0,0.12) 8%, rgba(255,170,0,0.7) 30%, #FFAA00 50%, rgba(255,170,0,0.7) 70%, rgba(255,170,0,0.12) 92%, transparent 100%)",
          boxShadow:
            "0 0 6px rgba(255,170,0,0.5), 0 0 16px rgba(255,170,0,0.15)",
        }}
        aria-hidden="true"
      />

      {/* ── GLITCH OVERLAY ── */}
      <div
        ref={glitchRef}
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FFAA00]/10 via-transparent to-[#FFAA00]/10 opacity-0"
        style={{ zIndex: 3 }}
        aria-hidden="true"
      />

      {/* ── SCANLINE EFFECT ── */}
      <div
        ref={scanlineRef}
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-0"
        style={{ zIndex: 3 }}
        aria-hidden="true"
      >
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFAA00]/30 to-transparent" />
      </div>

      {/* ── TOP: HEADER METADATA ── */}
      {/*
       * z-index 10 ensures content is always above the panels (z-index 1).
       * Removed Tailwind z-10 class — using inline style for precision.
       */}
      <div
        ref={headerRef}
        className="w-full flex items-center justify-between relative"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-[#FFAA00] font-bold tracking-[0.2em]">
            ZB.
          </span>
          <span className="font-mono text-[0.625rem] text-white/35 tracking-[0.16em] uppercase">
            // SYS_BOOT · 2026
          </span>
        </div>
        <TechnicalLabel variant="muted" prefix="[" suffix="]">
          ENV_PRODUCTION
        </TechnicalLabel>
      </div>

      {/* ── CENTER: SYSTEM INITIALIZATION FRAME ── */}
      <div
        ref={frameRef}
        className="w-full max-w-lg mx-auto my-auto flex flex-col gap-5 relative"
        style={{ zIndex: 10 }}
      >
        <TechnicalFrame
          code="BOOT"
          title="SYSTEM INITIALIZATION"
          headerRight={
            <TechnicalLabel variant="amber" prefix="//">
              BUILD_2026.1
            </TechnicalLabel>
          }
        >
          <div className="flex flex-col gap-[0.65rem] py-2" aria-hidden="true">
            {/* Stage 0 */}
            <div
              ref={stage0}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">CORE_ENGINE</span>
              <span className="text-[#FFAA00]">[ READY ]</span>
            </div>

            {/* Stage 1 */}
            <div
              ref={stage1}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">INTERFACE_SYSTEM</span>
              <span className="text-[#FFAA00]">[ READY ]</span>
            </div>

            {/* Stage 2 */}
            <div
              ref={stage2}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">DOSSIER_DATA</span>
              <span className="text-[#FFAA00]">[ INDEXED ]</span>
            </div>

            {/* Stage 3 */}
            <div
              ref={stage3}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">SECURITY_CHANNEL</span>
              <span className="text-[#FFAA00]">[ SECURE ]</span>
            </div>

            <TechnicalDivider className="my-1" />

            {/* System Ready Status */}
            <div
              ref={statusReadyRef}
              className="flex items-center justify-center pt-1"
            >
              <TechnicalStatus
                label="SYSTEM ONLINE // INTERFACE UNLOCKED"
                variant="amber"
                pulse
              />
            </div>
          </div>
        </TechnicalFrame>
      </div>

      {/* ── BOTTOM: PROGRESS INDICATOR ── */}
      <div
        ref={progressWrapperRef}
        className="w-full max-w-lg mx-auto flex flex-col gap-[0.4rem] relative"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <div className="flex items-center justify-between font-mono text-[0.6rem] tracking-[0.16em] uppercase">
          <span className="text-white/30">BOOT_SEQUENCE · 004 / 004</span>
          <span
            ref={progressTextRef}
            className="text-[#FFAA00] font-semibold tabular-nums"
          >
            000%
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-px bg-white/10 relative overflow-hidden">
          <div
            ref={progressLineRef}
            className="absolute left-0 top-0 h-full bg-[#FFAA00]"
            style={{
              width: "0%",
              boxShadow: "0 0 6px rgba(255,170,0,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}