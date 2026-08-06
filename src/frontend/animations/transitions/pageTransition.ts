/**
 * ─── Page Transition Animations ──────────────────────────────────────────────
 *
 * Route transition system — public portfolio ↔ project case study.
 *
 * Architecture (implemented in Projects/Transitions task):
 *   Router event → TransitionManager → playProjectOpen() / playProjectClose()
 *
 * FLIP approach:
 *   Use GSAP Flip plugin to smoothly expand a project card image
 *   into the full case study hero image.
 *
 * Future registration:
 *   When implemented, register Flip plugin in gsap.ts:
 *   import { Flip } from "gsap/Flip";
 *   gsap.registerPlugin(Flip);
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface ProjectTransitionRefs {
  card: HTMLElement | null;
  cardImage: HTMLElement | null;
  overlay: HTMLElement | null;
}

/**
 * playProjectOpen
 *
 * Animates from the project card into the case study view.
 * Returns a promise that resolves when the transition completes.
 */
export async function playProjectOpen(
  _refs: ProjectTransitionRefs
): Promise<void> {
  // TODO: Transitions task implementation
}

/**
 * playProjectClose
 *
 * Animates from the case study back to the project card.
 * Returns a promise that resolves when the transition completes.
 */
export async function playProjectClose(
  _refs: ProjectTransitionRefs
): Promise<void> {
  // TODO: Transitions task implementation
}

/**
 * Helper: get a reusable page transition timeline for simple route changes
 * (not card-expansion transitions — those use FLIP).
 */
export function buildPageTransition(): GSAPTimeline | null {
  // TODO: Transitions task implementation
  return null;
}
