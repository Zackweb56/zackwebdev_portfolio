/**
 * ─── GSAP Animation Types ────────────────────────────────────────────────────
 *
 * Shared TypeScript types for the animation architecture.
 *
 * Keeping types in one place:
 *  - avoids circular imports between animation modules
 *  - makes future refactors painless (one file to update)
 *  - documents the conventions for future developers
 */

import type { gsap } from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Re-export GSAP core types ────────────────────────────────────────────────

/** A GSAP timeline instance */
export type GSAPTimeline = ReturnType<typeof gsap.timeline>;

/** A GSAP tween instance */
export type GSAPTween = ReturnType<typeof gsap.to>;

/** A ScrollTrigger instance */
export type GSAPScrollTrigger = InstanceType<typeof ScrollTrigger>;

/** A GSAP context (cleanup scope) */
export type GSAPContext = ReturnType<typeof gsap.context>;

// ─── Animation targets ────────────────────────────────────────────────────────

/**
 * AnimationTarget
 *
 * The things GSAP can animate.
 * Prefer typed refs (HTMLDivElement | null) over generic Element.
 */
export type AnimationTarget =
  | HTMLElement
  | SVGElement
  | Element
  | null
  | undefined;

// ─── Responsive breakpoints ───────────────────────────────────────────────────

/**
 * Breakpoints used with gsap.matchMedia().
 * Mirrors the Tailwind/CSS breakpoint system.
 */
export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  mobile: "(max-width: 767px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

export type BreakpointKey = keyof typeof breakpoints;

// ─── Animation options ────────────────────────────────────────────────────────

/**
 * BaseAnimationOptions
 *
 * Common options accepted by reusable animation functions.
 * Functions may extend this with feature-specific properties.
 */
export interface BaseAnimationOptions {
  /**
   * Optional parent timeline to add this animation into.
   * If omitted, the animation creates its own standalone timeline.
   */
  timeline?: GSAPTimeline;

  /**
   * Position in the parent timeline (see GSAP position parameter).
   * Examples: "+=0.1", "<", ">-0.2", 0
   */
  position?: string | number;

  /**
   * Override animation duration (seconds).
   * Defaults to durations.normal if not provided.
   */
  duration?: number;

  /**
   * Override animation delay (seconds).
   */
  delay?: number;

  /**
   * Called when the animation completes.
   */
  onComplete?: () => void;
}

// ─── Stagger config ───────────────────────────────────────────────────────────

/**
 * StaggerConfig
 *
 * Consistent stagger configuration for grouped elements.
 * Usage: gsap.from(items, { stagger: defaultStagger })
 */
export interface StaggerConfig {
  /** Time between each item's start (seconds) */
  each: number;
  /** Animation start direction */
  from?: "start" | "end" | "center" | number;
}

/**
 * Default stagger values.
 * Controlled — avoids large intervals that feel slow.
 */
export const staggerPresets = {
  /** Navigation items, tight lists */
  tight: { each: 0.06, from: "start" } satisfies StaggerConfig,
  /** Cards, metadata rows, section items */
  normal: { each: 0.08, from: "start" } satisfies StaggerConfig,
  /** Large reveals — project cards in a grid */
  loose: { each: 0.12, from: "start" } satisfies StaggerConfig,
} as const;
