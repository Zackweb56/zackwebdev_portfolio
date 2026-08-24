"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/frontend/animations/gsap";


/**
 * IntroLoader
 *
 * Cinematic Developer System Initialization Sequence with premium GSAP animations.
 *
 * Visual concept:
 *   SYSTEM BOOT → SYSTEM READY → GATE OPEN → PORTFOLIO REVEAL
 *
 * Premium "Gate Opening" effect - Minimalist Black & White:
 *   When SYSTEM READY is confirmed, a subtle white seam line appears
 *   at the center. The line splits into two - top line moves up with
 *   the top panel, bottom line moves down with the bottom panel,
 *   creating a seamless gate opening effect.
 */
export function IntroLoader() {
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  // ─── GATE OPEN PANEL REFS ─────────────────────────────────────────────────
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const splitLineRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  // Mount: lock scroll + suppress flashlight
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("is-booting");
    
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("is-booting");
      clearTimeout(timer);
    };
  }, []);

  // Run GSAP timeline
  useEffect(() => {
    if (isComplete || !isMounted) return;
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
    const topPanel = topPanelRef.current;
    const bottomPanel = bottomPanelRef.current;
    const splitLine = splitLineRef.current;
    const topLine = topLineRef.current;
    const bottomLine = bottomLineRef.current;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
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
      if (topPanel) gsap.set(topPanel, { y: "0%", transformOrigin: "top center" });
      if (bottomPanel) gsap.set(bottomPanel, { y: "0%", transformOrigin: "bottom center" });
      if (splitLine) gsap.set(splitLine, { opacity: 0, scaleX: 0, transformOrigin: "center center" });
      if (topLine) gsap.set(topLine, { opacity: 0, y: 0, scaleX: 0, transformOrigin: "center center" });
      if (bottomLine) gsap.set(bottomLine, { opacity: 0, y: 0, scaleX: 0, transformOrigin: "center center" });

      // ─── MASTER TIMELINE ──────────────────────────────────────────────────
      const tl = gsap.timeline();

      // 0.00s: Initial pause
      tl.addLabel("start", 0.2);

      // 0.20s: Progress bar fades in
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

      // 0.30s: Header metadata arrives
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

      // 0.60s: System frame focuses
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

      // 1.20s: Boot stages stagger in
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

      // 1.40s: Progress line fills
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

      // Progress counter
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

      // 2.70s: SYSTEM ONLINE ready badge
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

      // ─── GATE OPENING SEQUENCE WITH SPLIT LINES ─────────────────────────

      // 3.30s: Content elements fade out cleanly
      const contentElements = [header, frame, progressWrapper].filter(
        Boolean
      ) as HTMLElement[];

      if (contentElements.length) {
        tl.to(
          contentElements,
          {
            opacity: 0,
            y: -10,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "hold+=0.1"
        );
      }

      // 3.50s: Center seam line appears
      if (splitLine) {
        tl.to(
          splitLine,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          "hold+=0.3"
        );
      }

      // 3.80s: Split the line and open the gate simultaneously
      // Top line moves up with top panel
      if (topLine) {
        tl.to(
          topLine,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "hold+=0.6"
        );
        
        tl.to(
          topLine,
          {
            y: "-50%",
            opacity: 0,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "hold+=0.9"
        );
      }

      // Bottom line moves down with bottom panel
      if (bottomLine) {
        tl.to(
          bottomLine,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "hold+=0.6"
        );
        
        tl.to(
          bottomLine,
          {
            y: "50%",
            opacity: 0,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "hold+=0.9"
        );
      }

      // Center seam line fades as lines split
      if (splitLine) {
        tl.to(
          splitLine,
          {
            opacity: 0,
            scaleX: 0.3,
            duration: 0.3,
            ease: "power2.in",
          },
          "hold+=0.8"
        );
      }

      // Top panel slides UP
      if (topPanel) {
        tl.to(
          topPanel,
          {
            y: "-100%",
            duration: 1.0,
            ease: "power4.inOut",
          },
          "hold+=0.6"
        );
      }

      // Bottom panel slides DOWN
      if (bottomPanel) {
        tl.to(
          bottomPanel,
          {
            y: "100%",
            duration: 1.0,
            ease: "power4.inOut",
          },
          "hold+=0.6"
        );
      }

      // Gate open complete
      tl.call(finish, undefined, "hold+=1.6");
    }, container);

    return () => ctx.revert();
  }, [isComplete, isMounted]);

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
    <>
      {/* Black overlay flash guard during hydration */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{ 
          zIndex: 9999, 
          background: '#050505',
          opacity: !isMounted ? 1 : 0,
          transition: 'opacity 0.15s ease'
        }} 
        aria-hidden="true"
      />
      
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-auto flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
        style={{
          zIndex: "var(--z-overlays)",
          background: 'transparent',
        }}
        role="progressbar"
        aria-label="System Initializing"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* ── TOP GATE PANEL (Slides Center → Top) ── */}
        <div
          ref={topPanelRef}
          className="absolute top-0 left-0 w-full pointer-events-none bg-[#050505]"
          style={{ height: "calc(50% + 1px)", zIndex: 2 }}
          aria-hidden="true"
        />

        {/* ── BOTTOM GATE PANEL (Slides Center → Bottom) ── */}
        <div
          ref={bottomPanelRef}
          className="absolute bottom-0 left-0 w-full pointer-events-none bg-[#050505]"
          style={{ height: "calc(50% + 1px)", zIndex: 2 }}
          aria-hidden="true"
        />

        {/* ── SPLIT SEAM LINE (Center - appears first) ── */}
        <div
          ref={splitLineRef}
          className="absolute left-0 w-full pointer-events-none"
          style={{
            top: "50%",
            marginTop: "-0.5px",
            height: "1px",
            zIndex: 5,
            opacity: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0.15) 85%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* ── TOP LINE (Splits from center and moves up) ── */}
        <div
          ref={topLineRef}
          className="absolute left-0 w-full pointer-events-none"
          style={{
            top: "50%",
            marginTop: "-0.5px",
            height: "1px",
            zIndex: 6,
            opacity: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.1) 90%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* ── BOTTOM LINE (Splits from center and moves down) ── */}
        <div
          ref={bottomLineRef}
          className="absolute left-0 w-full pointer-events-none"
          style={{
            top: "50%",
            marginTop: "-0.5px",
            height: "1px",
            zIndex: 6,
            opacity: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.1) 90%, transparent 100%)",
          }}
          aria-hidden="true"
        />

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
          <div className="font-mono text-[0.65rem] tracking-[0.15em] text-[#FFAA00]/80">
            [ENV_PRODUCTION]
          </div>
        </div>

        {/* ── CENTER: SYSTEM INITIALIZATION FRAME ── */}
        <div
          ref={frameRef}
          className="w-full max-w-lg mx-auto my-auto flex flex-col gap-5 relative"
          style={{ zIndex: 10, opacity: 0 }}
        >
          {/* Inline TechnicalFrame — border panel with corner brackets & header */}
          <div className="relative border border-white/10 bg-[#050505]/80 p-5 sm:p-6">
            {/* Corner brackets */}
            <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />
            {/* Frame Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
              <div className="flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.15em] uppercase">
                <span className="text-[#FFAA00]">[BOOT]</span>
                <span className="text-white/60 font-semibold">SYSTEM INITIALIZATION</span>
              </div>
              <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-white/60">// BUILD_2026.1</span>
            </div>
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

                {/* TechnicalDivider inline — simple hr */}
                <div className="flex items-center gap-3 select-none my-1" role="separator" aria-hidden="true">
                  <div className="flex-1 h-px bg-white/10" />
                </div>

              {/* System Ready Status */}
              <div
                ref={statusReadyRef}
                style={{ opacity: 0 }}
                className="flex items-center justify-center pt-1"
              >
                {/* TechnicalStatus inline */}
                <div className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-[#FFAA00]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] animate-pulse" aria-hidden="true" />
                  <span>SYSTEM ONLINE // INTERFACE UNLOCKED</span>
                </div>
              </div>
            </div>
          </div>
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
    </>
  );
}