/**
 * ─── Profile Reveal Animations ───────────────────────────────────────────────
 *
 * Scroll-triggered reveal for the Profile section.
 *
 * Phases (implemented in Profile task):
 *   1. Section label    — fade up as section enters viewport
 *   2. Name / bio text  — staggered line reveals
 *   3. Skill tags       — staggered pop-in
 *   4. Technical meta   — metadata fade sequence
 *
 * Architecture:
 *   Uses createScrollTrigger() from utils.ts.
 *   Called inside useGSAP() with scope = profile container ref.
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface ProfileRefs {
  container: HTMLElement | null;
  label: HTMLElement | null;
  bio: HTMLElement | null;
  skills: HTMLElement[] | null;
  metadata: HTMLElement | null;
}

/**
 * buildProfileReveal
 *
 * Sets up scroll-triggered reveal for the profile section.
 * Must be called inside useGSAP() — cleanup is automatic.
 */
export function buildProfileReveal(_refs: ProfileRefs): GSAPTimeline | null {
  // TODO: Profile task implementation
  // 1. prefersReducedMotion() guard
  // 2. createTimeline({ paused: true })
  // 3. Add tweens
  // 4. createScrollTrigger({ trigger, animation: tl })
  return null;
}
