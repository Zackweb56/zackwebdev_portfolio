/**
 * ─── Intro Loader Timeline ───────────────────────────────────────────────────
 *
 * Controls the intro loading sequence.
 *
 * Phases (implemented in Hero/Loader task):
 *   1. Loader visible   — system boot text, progress indicator
 *   2. Loader exit      — fade out loader, reveal content beneath
 *   3. Page entrance    — trigger hero reveal timeline
 *
 * Architecture:
 *   Loader → onComplete → loaderTimeline.kill() → buildHeroReveal().play()
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface LoaderRefs {
  container: HTMLElement | null;
  progressBar: HTMLElement | null;
  systemText: HTMLElement | null;
  percentage: HTMLElement | null;
}

/**
 * buildLoaderTimeline
 *
 * Returns a ready-to-play timeline for the intro loader sequence.
 */
export function buildLoaderTimeline(_refs: LoaderRefs): GSAPTimeline | null {
  // TODO: Loader/Hero task implementation
  return null;
}
