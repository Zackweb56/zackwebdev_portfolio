/**
 * ─── GSAP Animation Utilities ────────────────────────────────────────────────
 *
 * Reusable motion primitives for the portfolio's global motion language.
 *
 * Rules for this file:
 *   ✓ Utility provides real value (saves meaningful repeated boilerplate)
 *   ✓ Utility is or will be used in 2+ feature animation files
 *   ✗ Do NOT abstract single-line GSAP calls into functions
 *   ✗ Do NOT put feature-specific logic here (that lives per-feature)
 *   ✗ Do NOT create 50 animation presets — keep the vocabulary minimal
 *
 * Motion Language:
 *   FAST RESPONSE + SMOOTH DECELERATION
 *   No bounce. No elastic. No generic SaaS fades.
 *   Motion communicates hierarchy and credibility.
 *
 * SSR Safety:
 *   Functions that access GSAP/DOM are called at runtime only
 *   (inside useEffect / event handlers), never at module import time.
 *   This file is safe to import in both client and server contexts.
 */

import { gsap } from "./gsap";
import type { GSAPTimeline, BaseAnimationOptions, AnimationTarget } from "./types";
import { eases } from "./eases";
import { durations } from "./durations";
import { distances } from "./distances";

// ─── prefersReducedMotion ─────────────────────────────────────────────────────

/**
 * prefersReducedMotion
 *
 * Synchronous check for the prefers-reduced-motion media query.
 *
 * Use this inside imperative animation functions:
 *
 *   export function buildHeroReveal(refs) {
 *     if (prefersReducedMotion()) {
 *       setVisible(refs.title);
 *       return null;
 *     }
 *     // ... full animation
 *   }
 *
 * NOTE: The React hook `useReducedMotion` is for reactive component state.
 * This utility is for animation functions that run inside effects.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── setVisible / setHidden ───────────────────────────────────────────────────

/**
 * setVisible
 *
 * Immediately make an element fully visible without animation.
 * Used as the reduced-motion fallback and for pre-animation state resets.
 *
 * IMPORTANT: Content must always be visible if JS fails or animation is disabled.
 * Never permanently hide content with GSAP.
 */
export function setVisible(target: AnimationTarget | AnimationTarget[]): void {
  if (!target) return;
  const targets = Array.isArray(target) ? target.filter(Boolean) : [target];
  if (targets.length === 0) return;
  gsap.set(targets, { opacity: 1, y: 0, x: 0, scale: 1, clipPath: "none", clearProps: "transform,opacity,clip-path" });
}

/**
 * setHidden
 *
 * Set the pre-animation state — hide an element before its reveal begins.
 * Always paired with a reveal call. Never leave elements permanently hidden.
 *
 * Fail-safe: If the reveal animation never plays, the element must still
 * become visible via CSS or a timeout fallback in the calling component.
 */
export function setHidden(target: AnimationTarget): void {
  if (!target) return;
  gsap.set(target, { opacity: 0 });
}

// ─── createTimeline ───────────────────────────────────────────────────────────

/**
 * createTimeline
 *
 * Creates a GSAP timeline with project-wide defaults.
 *
 * Usage:
 *   const tl = createTimeline({ paused: true });
 *   tl.from(titleRef.current, { opacity: 0, y: distances.medium });
 */
export function createTimeline(vars: gsap.TimelineVars = {}): GSAPTimeline {
  return gsap.timeline({
    defaults: {
      ease: eases.content.enter,
      duration: durations.normal,
    },
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

// ─── Reveal Primitives ────────────────────────────────────────────────────────
//
// Three core reveal patterns that cover the entire portfolio's motion language.
// Feature animations (Hero, Profile, Projects, Contact) use these as building
// blocks inside their own feature-specific timelines.
//
// Motion hierarchy:
//   revealFade → Level 2 (UI/metadata)
//   revealUp   → Level 3 (Content headings/paragraphs)
//   revealClip → Level 4 (Editorial/cinematic reveals)

/**
 * revealFade
 *
 * Simple opacity reveal. No position change.
 *
 * Use for:
 *   - Technical metadata
 *   - Labels and stamps
 *   - Secondary UI elements
 *   - Dividers
 *   - Status indicators (non-pulsing reveal)
 *
 * Level 2 motion — UI layer.
 */
export function revealFade(
  target: AnimationTarget,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    onComplete?: () => void;
    paused?: boolean;
  } = {}
): GSAPTimeline {
  const {
    duration = durations.fast,
    delay = 0,
    ease = eases.ui.enter,
    onComplete,
    paused = false,
  } = options;

  const tl = createTimeline({ paused });

  if (!target) return tl;

  if (prefersReducedMotion()) {
    tl.set(target, { opacity: 1 });
    onComplete?.();
    return tl;
  }

  tl.from(target, { opacity: 0, duration, delay, ease, onComplete });
  return tl;
}

/**
 * revealUp
 *
 * Opacity + vertical translate reveal. The standard content entrance.
 *
 * Use for:
 *   - Section headings
 *   - Body paragraphs
 *   - Project titles
 *   - Profile text
 *   - Large UI elements
 *
 * Level 3 motion — Content layer.
 */
export function revealUp(
  target: AnimationTarget,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    distance?: number;
    onComplete?: () => void;
    paused?: boolean;
  } = {}
): GSAPTimeline {
  const {
    duration = durations.normal,
    delay = 0,
    ease = eases.content.enter,
    distance = distances.medium,
    onComplete,
    paused = false,
  } = options;

  const tl = createTimeline({ paused });

  if (!target) return tl;

  if (prefersReducedMotion()) {
    tl.set(target, { opacity: 1, y: 0 });
    onComplete?.();
    return tl;
  }

  tl.from(target, { opacity: 0, y: distance, duration, delay, ease, onComplete });
  return tl;
}

/**
 * revealClip
 *
 * Vertical clip-path reveal — the cinematic/editorial entrance.
 *
 * Use for:
 *   - Hero display names
 *   - Editorial typography
 *   - Project titles (detail view)
 *   - Section identifiers with dramatic entrance
 *
 * Motion: clip-path slides from bottom to full reveal, like a shutter opening.
 * CSS handles initial clip — GSAP animates it. No layout shift.
 *
 * Level 4 motion — Cinematic layer.
 *
 * Accessibility note: The element is visually hidden via clip, but remains
 * in the accessibility tree throughout. Screen readers are not affected.
 */
export function revealClip(
  target: AnimationTarget,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    direction?: "up" | "down" | "left" | "right";
    onComplete?: () => void;
    paused?: boolean;
  } = {}
): GSAPTimeline {
  const {
    duration = durations.slow,
    delay = 0,
    ease = eases.specialty.clip,
    direction = "up",
    onComplete,
    paused = false,
  } = options;

  const tl = createTimeline({ paused });

  if (!target) return tl;

  if (prefersReducedMotion()) {
    tl.set(target, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
    onComplete?.();
    return tl;
  }

  // Start positions map for clip-path inset
  const fromClip: Record<typeof direction, string> = {
    up:    "inset(100% 0% 0% 0%)",  // hidden below — reveal upward
    down:  "inset(0% 0% 100% 0%)",  // hidden above — reveal downward
    left:  "inset(0% 100% 0% 0%)",  // hidden right — reveal leftward
    right: "inset(0% 0% 0% 100%)",  // hidden left — reveal rightward
  };

  tl.fromTo(
    target,
    { clipPath: fromClip[direction], opacity: 1 },
    { clipPath: "inset(0% 0% 0% 0%)", duration, delay, ease, onComplete }
  );

  return tl;
}

/**
 * revealStagger
 *
 * Staggered revealUp for multiple elements (lists, cards, metadata rows).
 *
 * Use for:
 *   - Navigation items
 *   - Project card grids
 *   - Technical metadata rows
 *   - Skill tags
 *   - Any group of similar items
 *
 * @param targets  Array of elements or a CSS selector string
 * @param options  Animation options + stagger amount
 */
export function revealStagger(
  targets: AnimationTarget[] | string,
  options: {
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
    distance?: number;
    onComplete?: () => void;
    paused?: boolean;
  } = {}
): GSAPTimeline {
  const {
    duration = durations.normal,
    delay = 0,
    stagger = 0.08,
    ease = eases.content.enter,
    distance = distances.small,
    onComplete,
    paused = false,
  } = options;

  const tl = createTimeline({ paused });

  if (!targets || (Array.isArray(targets) && targets.filter(Boolean).length === 0)) {
    return tl;
  }

  if (prefersReducedMotion()) {
    tl.set(targets as gsap.TweenTarget, { opacity: 1, y: 0 });
    onComplete?.();
    return tl;
  }

  tl.from(targets as gsap.TweenTarget, {
    opacity: 0,
    y: distance,
    duration,
    delay,
    ease,
    stagger,
    onComplete,
  });

  return tl;
}

// ─── createScrollTrigger ─────────────────────────────────────────────────────

/**
 * createScrollTrigger
 *
 * Wraps ScrollTrigger.create() with consistent defaults for this portfolio.
 *
 * Always call inside useGSAP() — cleanup is automatic via gsap.context().
 *
 * Usage (inside useGSAP callback):
 *   createScrollTrigger({
 *     trigger: containerRef.current,
 *     animation: tl,
 *     start: "top 80%",
 *   });
 *
 * Scroll philosophy:
 *   - Use `once: true` for content reveals (they don't repeat)
 *   - Use `scrub: 1` only for genuine scroll-progress effects
 *   - Avoid scrollTrigger on every small element
 */
export function createScrollTrigger(config: {
  trigger: AnimationTarget;
  animation?: GSAPTimeline;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  once?: boolean;
}): void {
  if (typeof window === "undefined") return;

  const {
    trigger,
    animation,
    start = "top 85%",
    end = "bottom 15%",
    scrub = false,
    pin = false,
    markers = false,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    once = true,
  } = config;

  if (!trigger) return;

  // ScrollTrigger is already registered via gsap.ts at module level
  import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
    ScrollTrigger.create({
      trigger: trigger as Element,
      animation,
      start,
      end,
      scrub,
      pin,
      // Only show markers in development and only if explicitly requested
      markers: process.env.NODE_ENV === "development" ? markers : false,
      once,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
    });
  });
}

// ─── fadeReveal (legacy alias) ────────────────────────────────────────────────

/**
 * @deprecated Use revealFade or revealUp instead.
 * Kept for backwards compatibility with Task 7 code.
 */
export function fadeReveal(
  target: AnimationTarget,
  options: Omit<BaseAnimationOptions, "timeline" | "position"> & {
    y?: number;
  } = {}
): GSAPTimeline {
  const { duration = durations.normal, delay = 0, onComplete, y = distances.medium } = options;

  if (y === 0) {
    return revealFade(target, { duration, delay, onComplete });
  }
  return revealUp(target, { duration, delay, distance: y, onComplete });
}
