/**
 * ─── Horizontal Scroll / Project Gallery ─────────────────────────────────────
 *
 * Scroll-driven horizontal gallery for the projects section.
 *
 * Architecture (implemented in Projects task):
 *   Uses ScrollTrigger's horizontal scroll pinning.
 *   gsap.to(track, { x: -totalWidth, scrollTrigger: { scrub: 1 } })
 *
 * Cleanup:
 *   All ScrollTriggers are tracked by gsap.context() via useGSAP().
 *   On unmount or route change, context.revert() clears them.
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface ProjectGalleryRefs {
  container: HTMLElement | null;
  track: HTMLElement | null;
  cards: HTMLElement[];
}

/**
 * buildHorizontalScroll
 *
 * Sets up the horizontal scroll pin for the projects gallery.
 * Must be called inside useGSAP() — cleanup is automatic.
 *
 * @returns The scroll-linked timeline (for external control if needed)
 */
export function buildHorizontalScroll(
  _refs: ProjectGalleryRefs
): GSAPTimeline | null {
  // TODO: Projects task implementation
  // 1. prefersReducedMotion() guard — fall back to vertical scroll
  // 2. Calculate track width
  // 3. gsap.to(refs.track, { x: -totalWidth, ease: "none",
  //      scrollTrigger: { trigger, pin: true, scrub: 1 } })
  return null;
}
