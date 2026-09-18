"use client";

import React, { useEffect, useRef } from "react";
import { FlashlightContent } from "@/frontend/components/flashlight";
import { HeroContent } from "@/frontend/lib/heroContent";
import { HeroBackgroundAmbient, HeroBackgroundDiscovery } from "./HeroBackground";

interface HeroProps {
  content?: HeroContent | null;
  className?: string;
}

export function Hero({ content, className = "" }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  // ─── Cursor-driven reticle + flashlight mask ────────────────────────────
  // One native listener, zero React state. GSAP quickTo owns the reticle.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let cleanup = () => {};

    import("@/frontend/animations/gsap").then(({ gsap }) => {
      const reticleX = gsap.quickTo(reticleRef.current, "x", { duration: 0.5, ease: "power3" });
      const reticleY = gsap.quickTo(reticleRef.current, "y", { duration: 0.5, ease: "power3" });

      const handleMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const nx = (px / rect.width) * 2 - 1;
        const ny = (py / rect.height) * 2 - 1;

        // Reticle follows cursor position within the section
        reticleX(px);
        reticleY(py);

        // Coordinate readout — direct DOM write, no re-render
        if (coordRef.current) {
          coordRef.current.textContent = `X ${nx.toFixed(2)}  Y ${ny.toFixed(2)}`;
        }
      };

      const handleEnter = () => {
        gsap.to(reticleRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
      };
      const handleLeave = () => {
        gsap.to(reticleRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.out" });
      };

      container.addEventListener("mousemove", handleMove);
      container.addEventListener("mouseenter", handleEnter);
      container.addEventListener("mouseleave", handleLeave);

      cleanup = () => {
        container.removeEventListener("mousemove", handleMove);
        container.removeEventListener("mouseenter", handleEnter);
        container.removeEventListener("mouseleave", handleLeave);
      };
    });

    return () => cleanup();
  }, []);

  // ─── GSAP Intro Animation ──────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("@/frontend/animations/gsap").then(({ gsap }) => {
      const container = containerRef.current;
      if (!container) return;

      const ctx = gsap.context(() => {
        const els = {
          eyebrow: container.querySelector<HTMLElement>('[data-hero="eyebrow"]'),
          name:    container.querySelector<HTMLElement>('[data-hero="name"]'),
          role:    container.querySelector<HTMLElement>('[data-hero="role"]'),
          bio:     container.querySelector<HTMLElement>('[data-hero="bio"]'),
          scroll:  container.querySelector<HTMLElement>('[data-hero="scroll"]'),
        };

        if (reducedMotion) {
          Object.values(els).forEach((el) => {
            if (el) gsap.set(el, { opacity: 1 });
          });
          return;
        }

        if (els.eyebrow) gsap.set(els.eyebrow, { opacity: 0, y: -10 });
        if (els.name)    gsap.set(els.name,    { opacity: 0, y: 28, filter: "blur(8px)" });
        if (els.role)    gsap.set(els.role,    { opacity: 0, y: 12 });
        if (els.bio)     gsap.set(els.bio,     { opacity: 0, y: 10 });
        if (els.scroll)  gsap.set(els.scroll,  { opacity: 0, y: 6 });

        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(els.eyebrow, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
          .to(els.name,    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" }, "-=0.15")
          .to(els.role,    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.35")
          .to(els.bio,     { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.3")
          .to(els.scroll,  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
      }, container);

      return () => ctx.revert();
    });
  }, []);

  // ── Null guard: no content from DB ──────────────────────────────────────────
  if (!content) {
    return (
      <section
        id="hero"
        className={`relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 bg-[#080808] overflow-hidden ${className}`}
        aria-label="Hero — Identity"
      >
        <HeroBackgroundAmbient />
        <div className="relative z-10 flex flex-col items-center text-center gap-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500/40 bg-amber-500/[0.06] rounded-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" aria-hidden="true" />
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-amber-300 uppercase">
              [ IDENTITY DATA UNAVAILABLE ]
            </span>
          </div>
          <p className="font-mono text-xs text-white/40 tracking-wider">
            Hero content not yet configured — add it via the admin panel.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 bg-[#080808] overflow-hidden ${className}`}
      aria-label="Hero — Identity"
    >
      {/* ── Layer 0: GSAP ambient micro-particles (desktop only, perimeter only) ── */}
      <HeroBackgroundAmbient />

      {/* ── Layer 1: Flashlight-only background (grid + discovery fragments) ──
           Hidden on mobile viewports so mobile displays ONLY the clean hero content itself. ── */}
      <div className="hidden md:block absolute inset-0 overflow-hidden" aria-hidden="true">
        <FlashlightContent className="h-full">
          <HeroBackgroundDiscovery />
        </FlashlightContent>
      </div>

      {/* ── Reticle: tracks the cursor on desktop only; hidden on touch/mobile ── */}
      <div
        ref={reticleRef}
        className="hidden md:flex absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 pointer-events-none opacity-0 z-20 items-center justify-center"
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke="#FFAA00" strokeWidth="0.75" opacity="0.5" />
          <path d="M16 2v6M16 24v6M2 16h6M24 16h6" stroke="#FFAA00" strokeWidth="0.75" opacity="0.7" />
          <circle cx="16" cy="16" r="1.5" fill="#FFAA00" />
        </svg>
        <span
          ref={coordRef}
          className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.55rem] tracking-[0.15em] text-[#FFAA00]/70"
        >
          X 0.00  Y 0.00
        </span>
      </div>

      {/* ── Layer 2: Hero content — always fully visible, no flashlight effect ──
           Rendered outside FlashlightContent so opacity is never reduced. ── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl w-full mx-auto">
        <div data-hero="eyebrow" className="inline-flex items-center gap-2 select-none" aria-label={`Status: ${content.availability}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-white/40 uppercase">
            {content.availability}
          </span>
        </div>

        <h1 data-hero="name" className="font-sans font-extrabold tracking-tight leading-[1.05] text-white text-4xl sm:text-6xl lg:text-7xl select-none">
          {content.name.first} <span className="text-white/80">{content.name.last}</span>
        </h1>

        <p data-hero="role" className="font-mono text-xs sm:text-sm tracking-[0.22em] text-[#FFAA00] uppercase">
          {content.role}
        </p>

        <p data-hero="bio" className="text-white/55 text-sm sm:text-base leading-relaxed max-w-lg font-sans">
          {content.bio}
        </p>
      </div>

      {/* ── Scroll cue ── */}
      <a
        data-hero="scroll"
        href="#profile"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 group z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFAA00] focus-visible:ring-offset-2 rounded-sm"
        aria-label="Scroll to next section"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30 uppercase group-hover:text-[#FFAA00] transition-colors duration-200">
          {content.scrollLabel}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/25 group-hover:text-[#FFAA00] transition-colors duration-200 group-hover:translate-y-0.5" aria-hidden="true">
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}