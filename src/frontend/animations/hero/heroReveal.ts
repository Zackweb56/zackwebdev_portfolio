/**
 * ─── Hero Reveal Timeline ────────────────────────────────────────────────────
 *
 * Builds the hero section entrance animation.
 *
 * Phases (implemented in Hero task):
 *   1. Name reveal     — clip-path slide up, large display type
 *   2. Subtitle        — fade + translate up
 *   3. Metadata row    — staggered fade
 *   4. Decorative UI   — technical labels, dividers
 *   5. Cursor active   — cursor transitions to active state
 *
 * Called by: HeroSection component, after GsapProvider mounts.
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface HeroRefs {
  container: HTMLElement | null;
  name: HTMLElement | null;
  subtitle: HTMLElement | null;
  metadata: HTMLElement | null;
  decorative: HTMLElement | null;
}

/**
 * buildHeroReveal
 *
 * Returns a paused timeline. The caller is responsible for playing it.
 * This allows sequencing with a loader exit if needed.
 *
 * @param refs   - Typed refs to hero DOM elements
 * @returns      A paused GSAP timeline
 */
export function buildHeroReveal(_refs: HeroRefs): GSAPTimeline | null {
  // TODO: Hero task implementation
  // 1. Import { gsap, createTimeline, durations, eases, prefersReducedMotion }
  // 2. If prefersReducedMotion() → setVisible all refs, return null
  // 3. Create paused timeline
  // 4. Add phase tweens
  // 5. Return timeline (caller calls .play())
  return null;
}
