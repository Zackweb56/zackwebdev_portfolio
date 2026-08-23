"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/frontend/animations/gsap";
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
 * Technical details:
 *   - No session/local storage
 *   - GSAP timeline killed on cleanup via gsap.context().revert()
 *   - Body scroll locked during boot, released on completion or unmount
 *   - html.is-booting class suppresses flashlight until boot completes
 *   - Initial JSX elements start at opacity: 0 to prevent any FOUC on page reload
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

  // ─── CRACK-OPEN PANEL REFS ─────────────────────────────────────────────────
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
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
    const container = containerRef.current;
    if (!container) return;

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
      if (header) gsap.set(header, { opacity: 0, y: -8, filter: "blur(3px)" });
      if (frame) gsap.set(frame, { opacity: 0, scale: 0.96, filter: "blur(5px)" });
      if (stages.length) gsap.set(stages, { opacity: 0, y: 5, filter: "blur(2px)" });
      if (statusReady) gsap.set(statusReady, { opacity: 0, scale: 0.92, filter: "blur(2px)" });
      if (progressLine) gsap.set(progressLine, { width: "0%" });
      if (progressWrapper) gsap.set(progressWrapper, { opacity: 0 });
      if (scanline) gsap.set(scanline, { opacity: 0, y: "-100%" });
      if (glitch) gsap.set(glitch, { opacity: 0 });
      if (topPanel) gsap.set(topPanel, { y: "0%", transformOrigin: "top center" });
      if (bottomPanel) gsap.set(bottomPanel, { y: "0%", transformOrigin: "bottom center" });
      if (splitLine) gsap.set(splitLine, { opacity: 0, scaleX: 0, transformOrigin: "center center" });

      // ─── MASTER TIMELINE ──────────────────────────────────────────────────
      const tl = gsap.timeline();

      // 0.00s: Initial pause, solid dark environment holds for 0.2s
      tl.addLabel("start", 0.2);

      // 0.20s: Progress bar fades in at 0%
      if (progressWrapper) {
        tl.to(
          progressWrapper,
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "start"
        );
      }

      // 0.30s: Header metadata arrives smoothly
      if (header) {
        tl.to(
          header,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power3.out",
          },
          "start+=0.1"
        );
      }

      // 0.50s: Scanline sweep across the viewport
      if (scanline) {
        tl.to(
          scanline,
          {
            opacity: 1,
            duration: 0.1,
          },
          "start+=0.3"
        );
        tl.to(
          scanline,
          {
            y: "100%",
            duration: 0.8,
            ease: "power2.inOut",
          },
          "start+=0.3"
        );
        tl.to(
          scanline,
          {
            opacity: 0,
            duration: 0.15,
          },
          "start+=0.95"
        );
      }

      // 0.60s: System frame de-blurs and scales into focus
      if (frame) {
        tl.to(
          frame,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power4.out",
          },
          "start+=0.4"
        );
      }

      // 1.10s: Brief glitch overlay flash
      if (glitch) {
        tl.to(
          glitch,
          {
            opacity: 1,
            duration: 0.04,
          },
          "start+=0.9"
        );
        tl.to(
          glitch,
          {
            opacity: 0,
            duration: 0.06,
          },
          "start+=0.94"
        );
        tl.to(
          glitch,
          {
            opacity: 0.6,
            duration: 0.03,
          },
          "start+=1.02"
        );
        tl.to(
          glitch,
          {
            opacity: 0,
            duration: 0.05,
          },
          "start+=1.05"
        );
      }

      // 1.20s: Boot stages stagger in with precise typing feel
      if (stages.length) {
        tl.to(
          stages,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.35,
            stagger: 0.22,
            ease: "power3.out",
          },
          "start+=1.0"
        );
      }

      // 1.40s: Progress line fills smoothly from 0% to 100%
      if (progressLine) {
        tl.to(
          progressLine,
          {
            width: "100%",
            duration: 1.4,
            ease: "power2.inOut",
          },
          "start+=1.2"
        );
      }

      // Progress counter animation
      if (progressText) {
        const counter = { val: 0 };
        tl.to(
          counter,
          {
            val: 100,
            duration: 1.4,
            ease: "power2.inOut",
            onUpdate: () => {
              const formatted = Math.round(counter.val)
                .toString()
                .padStart(3, "0");
              if (progressText) {
                progressText.textContent = `${formatted}%`;
              }
            },
          },
          "start+=1.2"
        );
      }

      // 2.70s: SYSTEM ONLINE ready badge emerges
      if (statusReady) {
        tl.to(
          statusReady,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "back.out(1.5)",
          },
          "start+=2.5"
        );
      }

      // 3.20s: Hold at system ready
      tl.addLabel("hold", "start+=3.0");

      // 3.40s: Content elements fade before panels split
      const contentElements = [header, frame, progressWrapper].filter(
        Boolean
      ) as HTMLElement[];

      if (contentElements.length) {
        tl.to(
          contentElements,
          {
            opacity: 0,
            y: -10,
            duration: 0.35,
            ease: "power2.in",
          },
          "hold+=0.2"
        );
      }

      // 3.75s: Crack seam line activates
      if (splitLine) {
        tl.to(
          splitLine,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.25,
            ease: "power3.out",
          },
          "hold+=0.45"
        );
      }

      // 4.00s: Top panel slides UP (-102%)
      if (topPanel) {
        tl.to(
          topPanel,
          {
            y: "-102%",
            duration: 0.85,
            ease: "power4.inOut",
          },
          "hold+=0.6"
        );
      }

      // 4.00s: Bottom panel slides DOWN (+102%)
      if (bottomPanel) {
        tl.to(
          bottomPanel,
          {
            y: "102%",
            duration: 0.85,
            ease: "power4.inOut",
          },
          "hold+=0.6"
        );
      }

      // Seam line fades as panels depart
      if (splitLine) {
        tl.to(
          splitLine,
          {
            opacity: 0,
            scaleX: 1.1,
            duration: 0.35,
            ease: "power2.in",
          },
          "hold+=0.7"
        );
      }

      // 4.85s: Entire loader completes
      tl.call(finish, undefined, "hold+=1.35");
    }, container);

    return () => ctx.revert();
  }, [isComplete]);

  function finish() {
    document.body.style.overflow = "";
    document.documentElement.classList.remove("is-booting");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero:ready"));
    }
    setIsComplete(true);
  }

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
      style={{
        zIndex: "var(--z-overlays)",
      }}
      role="progressbar"
      aria-label="System Initializing"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* ── TOP PANEL ── */}
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 w-full pointer-events-none bg-[#050505]"
        style={{ height: "calc(50% + 1px)", zIndex: 1 }}
        aria-hidden="true"
      />

      {/* ── BOTTOM PANEL ── */}
      <div
        ref={bottomPanelRef}
        className="absolute bottom-0 left-0 w-full pointer-events-none bg-[#050505]"
        style={{ height: "calc(50% + 1px)", zIndex: 1 }}
        aria-hidden="true"
      />

      {/* ── SPLIT SEAM LINE ── */}
      <div
        ref={splitLineRef}
        className="absolute left-0 w-full pointer-events-none"
        style={{
          top: "50%",
          marginTop: "-0.5px",
          height: "1px",
          zIndex: 5,
          opacity: 0,
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
      <div
        ref={headerRef}
        className="w-full flex items-center justify-between relative"
        style={{ zIndex: 10, opacity: 0 }}
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
        style={{ zIndex: 10, opacity: 0 }}
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
              style={{ opacity: 0 }}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">CORE_ENGINE</span>
              <span className="text-[#FFAA00]">[ READY ]</span>
            </div>

            {/* Stage 1 */}
            <div
              ref={stage1}
              style={{ opacity: 0 }}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">INTERFACE_SYSTEM</span>
              <span className="text-[#FFAA00]">[ READY ]</span>
            </div>

            {/* Stage 2 */}
            <div
              ref={stage2}
              style={{ opacity: 0 }}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">DOSSIER_DATA</span>
              <span className="text-[#FFAA00]">[ INDEXED ]</span>
            </div>

            {/* Stage 3 */}
            <div
              ref={stage3}
              style={{ opacity: 0 }}
              className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em]"
            >
              <span className="text-white/45">SECURITY_CHANNEL</span>
              <span className="text-[#FFAA00]">[ SECURE ]</span>
            </div>

            <TechnicalDivider className="my-1" />

            {/* System Ready Status */}
            <div
              ref={statusReadyRef}
              style={{ opacity: 0 }}
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
        style={{ zIndex: 10, opacity: 0 }}
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