/**
 * ─── Global Page Entrance Animation ─────────────────────────────────────────
 *
 * Called once when the intro loader completes.
 *
 * Responsibilities:
 *   - Fade in the global navigation
 *   - Activate the technical overlay corners
 *   - Signal to the Hero component to begin its reveal timeline
 *
 * Architecture (implemented in Loader/Hero task):
 *   loaderTimeline.onComplete → playPageEntrance() → heroReveal.play()
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface PageEntranceRefs {
  navigation: HTMLElement | null;
  overlay: HTMLElement | null;
}

/**
 * playPageEntrance
 *
 * Returns a timeline. Caller chains onComplete to trigger the hero reveal.
 */
export function playPageEntrance(
  _refs: PageEntranceRefs
): GSAPTimeline | null {
  // TODO: Loader/Hero task implementation
  return null;
}
