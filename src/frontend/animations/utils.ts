/**
 * ─── GSAP Animation Utilities ────────────────────────────────────────────────
 *
 * Thin helpers that wrap common GSAP patterns.
 *
 * Rules for adding to this file:
 *   ✓ Utility provides real value (saves meaningful boilerplate)
 *   ✓ Utility is used in 2+ feature animation files
 *   ✗ Do NOT abstract single-line GSAP calls
 *   ✗ Do NOT put feature-specific logic here (that lives per-feature)
 *
 * SSR Safety:
 *   All functions that access GSAP or the DOM are called at runtime
 *   (inside useEffect / event handlers), never at module import time.
 *   This file is safe to import in both client and server contexts —
 *   the functions themselves guard against SSR when needed.
 */

import { gsap } from "./gsap";
import type { GSAPTimeline, BaseAnimationOptions, AnimationTarget } from "./types";

// ─── prefersReducedMotion ─────────────────────────────────────────────────────

/**
 * Synchronous check for the prefers-reduced-motion media query.
 *
 * Use this inside animation functions to skip or simplify motion:
 *
 *   export function buildHeroReveal(refs) {
 *     if (prefersReducedMotion()) {
 *       gsap.set([refs.title, refs.subtitle], { opacity: 1 });
 *       return;
 *     }
 *     // ... full animation
 *   }
 *
 * NOTE: The React hook `useReducedMotion` is for reactive component state.
 * This utility is for imperative animation functions that run inside effects.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── createTimeline ───────────────────────────────────────────────────────────

/**
 * createTimeline
 *
 * Creates a GSAP timeline with sensible defaults for this portfolio.
 *
 * Usage:
 *   const tl = createTimeline({ paused: true });
 *   tl.from(titleRef.current, { opacity: 0, y: 20, duration: durations.normal });
 *
 * The returned timeline is the component's responsibility to:
 *   - play() when ready
 *   - kill() via gsap.context() cleanup (useGSAP handles this automatically)
 */
export function createTimeline(
  vars: gsap.TimelineVars = {}
): GSAPTimeline {
  return gsap.timeline({
    defaults: { ease: "power3.out" },
    ...vars,
  });
}

// ─── killTimeline ─────────────────────────────────────────────────────────────

/**
 * killTimeline
 *
 * Safely kills a timeline and its child tweens.
 * Pass `true` to also revert element styles to their original values.
 *
 * Usage:
 *   // Inside useEffect cleanup:
 *   return () => killTimeline(tlRef.current);
 *
 * NOTE: When using useGSAP(), cleanup is automatic via gsap.context().revert().
 * This utility is for manual lifecycle management where useGSAP isn't used.
 */
export function killTimeline(
  timeline: GSAPTimeline | null | undefined,
  revert = false
): void {
  if (!timeline) return;
  if (revert) {
    timeline.revert();
  } else {
    timeline.kill();
  }
}

// ─── fadeReveal ──────────────────────────────────────────────────────────────

/**
 * fadeReveal
 *
 * Minimal reusable fade + translate-up reveal.
 *
 * This is the foundational motion primitive — used for metadata, labels,
 * dividers, and secondary content. Hero titles use more complex clip-path
 * reveals built in their own feature modules.
 *
 * Returns the tween so callers can add it to parent timelines.
 *
 * Usage:
 *   fadeReveal(subtitleRef.current, { duration: durations.normal });
 *   // or inside a timeline:
 *   tl.add(fadeReveal(el, { duration: durations.fast }), "<0.1");
 */
export function fadeReveal(
  target: AnimationTarget,
  options: Omit<BaseAnimationOptions, "timeline" | "position"> & {
    y?: number;
  } = {}
): GSAPTimeline {
  const { duration = 0.45, delay = 0, onComplete, y = 16 } = options;

  const tl = createTimeline({ paused: false });

  if (!target) return tl;

  if (prefersReducedMotion()) {
    tl.set(target, { opacity: 1, y: 0 });
    return tl;
  }

  tl.from(target, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: "power3.out",
    onComplete,
  });

  return tl;
}

// ─── setVisible ──────────────────────────────────────────────────────────────

/**
 * setVisible
 *
 * Immediately make an element fully visible without animation.
 * Used as the reduced-motion fallback and for pre-animation state resets.
 *
 * Usage:
 *   setVisible(titleRef.current);
 */
export function setVisible(target: AnimationTarget): void {
  if (!target) return;
  gsap.set(target, { opacity: 1, y: 0, x: 0, scale: 1, clipPath: "none" });
}

// ─── setHidden ───────────────────────────────────────────────────────────────

/**
 * setHidden
 *
 * Immediately hide an element.
 * Used to set the pre-animation state before a reveal begins.
 *
 * Usage:
 *   setHidden(titleRef.current);  // before animation starts
 */
export function setHidden(target: AnimationTarget): void {
  if (!target) return;
  gsap.set(target, { opacity: 0 });
}

// ─── createScrollTrigger ─────────────────────────────────────────────────────

/**
 * createScrollTrigger
 *
 * Wraps ScrollTrigger.create() with consistent defaults for this portfolio.
 *
 * Future tasks will use this to create scroll-driven reveals for:
 *   - Profile section
 *   - Projects section
 *   - Technical metadata
 *   - Section transitions
 *
 * Usage (inside useGSAP callback):
 *   createScrollTrigger({
 *     trigger: containerRef.current,
 *     animation: tl,
 *     start: "top 80%",
 *   });
 */
export function createScrollTrigger(config: {
  trigger: AnimationTarget;
  animation?: GSAPTimeline;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  once?: boolean;
}): void {
  // ScrollTrigger is already registered in gsap.ts
  // Import dynamically here to avoid any SSR issues
  if (typeof window === "undefined") return;

  const {
    trigger,
    animation,
    start = "top 85%",
    end = "bottom 15%",
    scrub = false,
    markers = false,
    onEnter,
    onLeave,
    onEnterBack,
    once = true,
  } = config;

  if (!trigger) return;

  // Dynamic import to ensure SSR safety
  import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
    ScrollTrigger.create({
      trigger: trigger as Element,
      animation,
      start,
      end,
      scrub,
      markers: process.env.NODE_ENV === "development" ? markers : false,
      once,
      onEnter,
      onLeave,
      onEnterBack,
    });
  });
}
