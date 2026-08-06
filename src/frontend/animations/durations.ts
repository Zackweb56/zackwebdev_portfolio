/**
 * ─── GSAP Animation Duration Vocabulary ─────────────────────────────────────
 *
 * A small, intentional set of durations for the portfolio.
 *
 * Philosophy:
 *   Fast and precise — this portfolio is technical, editorial, controlled.
 *   No sluggish reveals. No childish bounce. Motion communicates hierarchy.
 *
 * Usage:
 *   import { durations } from "@/frontend/animations/durations";
 *   gsap.to(el, { duration: durations.normal, opacity: 1 });
 */

export const durations = {
  /**
   * Micro — instant feedback (cursor, button active state, status blink).
   * Feels immediate without a perceptible transition.
   */
  micro: 0.1,

  /**
   * Fast — UI transitions (hover enter/exit, label swaps, nav items).
   * Crisp and responsive.
   */
  fast: 0.2,

  /**
   * Normal — standard element reveals (text fade-up, metadata, dividers).
   * The workhorse duration. Most animations use this.
   */
  normal: 0.45,

  /**
   * Slow — larger reveals (section entrances, hero name, image clip reveal).
   * Deliberate and cinematic without being sluggish.
   */
  slow: 0.75,

  /**
   * Cinematic — full-page transitions, loader exit, project open/close.
   * Reserved for landmark moments only.
   */
  cinematic: 1.1,
} as const;

export type DurationName = keyof typeof durations;
