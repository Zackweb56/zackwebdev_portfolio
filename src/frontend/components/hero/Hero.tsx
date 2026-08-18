"use client";

import React, { useEffect, useRef } from "react";
import { FlashlightContent } from "@/frontend/components/flashlight";
import { defaultHeroContent, HeroContent } from "@/frontend/lib/heroContent";

interface HeroProps {
  /**
   * Content prop — leave empty to use static defaultHeroContent.
   * When backend is ready: pass the fetched DB record here from the
   * parent Server Component. Type is HeroContent — matches the API shape.
   */
  content?: HeroContent;
  className?: string;
}

/**
 * Hero Component
 *
 * Clean, professional identity screen. No tech badges — just the developer,
 * their role, and a short bio. Designed for an immediate first impression.
 *
 * Features:
 *   - FlashlightContent: cursor-driven inspection-light reveal (desktop only)
 *   - GSAP intro: single-pass reveal timeline on mount (no loops, no floats)
 *
 * ─── Backend Migration ───────────────────────────────────────────────────────
 * This component is already "backend-ready". The `content` prop mirrors the
 * HeroContent type. Once your API/DB is set up:
 *   1. Fetch data in page.tsx (Server Component).
 *   2. Pass it as: <Hero content={fetchedContent} />
 *   3. Remove / stop exporting `defaultHeroContent` from heroContent.ts.
 * ────────────────────────────────────────────────────────────────────────────
 */
export function Hero({ content = defaultHeroContent, className = "" }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── GSAP Intro Animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dynamically imported for SSR safety
    import("@/frontend/animations/gsap").then(({ gsap }) => {
      const container = containerRef.current;
      if (!container) return;

      const ctx = gsap.context(() => {
        // Grab animatable elements via data attributes
        const els = {
          eyebrow: container.querySelector<HTMLElement>('[data-hero="eyebrow"]'),
          name: container.querySelector<HTMLElement>('[data-hero="name"]'),
          role: container.querySelector<HTMLElement>('[data-hero="role"]'),
          divider: container.querySelector<HTMLElement>('[data-hero="divider"]'),
          bio: container.querySelector<HTMLElement>('[data-hero="bio"]'),
          scroll: container.querySelector<HTMLElement>('[data-hero="scroll"]'),
        };

        // If user prefers reduced motion — just show everything instantly
        if (reducedMotion) {
          Object.values(els).forEach((el) => {
            if (el) gsap.set(el, { opacity: 1 });
          });
          return;
        }

        // ── Pre-animation state ──
        if (els.eyebrow) gsap.set(els.eyebrow, { opacity: 0, y: -10 });
        if (els.name) gsap.set(els.name, { opacity: 0, y: 28, filter: "blur(8px)" });
        if (els.role) gsap.set(els.role, { opacity: 0, y: 12 });
        if (els.divider) gsap.set(els.divider, { opacity: 0, scaleX: 0, transformOrigin: "left" });
        if (els.bio) gsap.set(els.bio, { opacity: 0, y: 10 });
        if (els.scroll) gsap.set(els.scroll, { opacity: 0, y: 6 });

        // ── Single-pass reveal timeline ──
        const tl = gsap.timeline({ delay: 0.2 });

        tl.to(els.eyebrow, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
          .to(els.name, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" }, "-=0.15")
          .to(els.role, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.35")
          .to(els.divider, { opacity: 1, scaleX: 1, duration: 0.55, ease: "power2.inOut" }, "-=0.3")
          .to(els.bio, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.35")
          .to(els.scroll, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
      }, container);

      return () => ctx.revert();
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 ${className}`}
      aria-label="Hero — Identity"
    >
      {/*
       * FlashlightContent: wraps hero copy in the inspection-light system.
       * Desktop only (min-width: 1024px + fine pointer). Touch devices get
       * full readability with no effect. Do not remove or move this wrapper.
       */}
      <FlashlightContent className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col items-center text-center gap-5 max-w-2xl w-full mx-auto">

          {/* ── Eyebrow: Availability ── */}
          <div
            data-hero="eyebrow"
            className="inline-flex items-center gap-2 select-none"
            aria-label={`Status: ${content.availability}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] animate-pulse"
              aria-hidden="true"
            />
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-white/40 uppercase">
              {content.availability}
            </span>
          </div>

          {/* ── Name ── */}
          <h1
            data-hero="name"
            className="font-sans font-extrabold tracking-tight leading-[1.05] text-white text-4xl sm:text-6xl lg:text-7xl select-none"
          >
            {content.name.first}{" "}
            <span className="text-white/80">{content.name.last}</span>
          </h1>

          {/* ── Role ── */}
          <p
            data-hero="role"
            className="font-mono text-xs sm:text-sm tracking-[0.22em] text-[#FFAA00] uppercase"
          >
            {content.role}
          </p>

          {/* ── Divider ── */}
          <div
            data-hero="divider"
            className="w-12 h-px bg-white/15 my-1"
            aria-hidden="true"
          />

          {/* ── Bio ── */}
          <p
            data-hero="bio"
            className="text-white/55 text-sm sm:text-base leading-relaxed max-w-lg font-sans"
          >
            {content.bio}
          </p>
        </div>
      </FlashlightContent>

      {/* ── Scroll Cue — outside FlashlightContent so it's always fully visible ── */}
      <a
        data-hero="scroll"
        href="#profile"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFAA00] focus-visible:ring-offset-2 rounded-sm"
        aria-label="Scroll to next section"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30 uppercase group-hover:text-[#FFAA00] transition-colors duration-200">
          {content.scrollLabel}
        </span>
        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/25 group-hover:text-[#FFAA00] transition-colors duration-200 group-hover:translate-y-0.5"
          aria-hidden="true"
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
