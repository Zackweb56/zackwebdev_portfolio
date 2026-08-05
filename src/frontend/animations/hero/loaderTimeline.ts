/**
 * Intro loader GSAP timeline.
 * Sequence: INITIALIZING → LOADING PROFILE → LOADING PROJECT DATA → SYSTEM READY
 * Target duration: ~1.5–2.5 seconds.
 * Implemented in Task 4.2 (Build intro loader).
 */
import type { gsap as GSAPType } from "gsap";

export function buildLoaderTimeline(_gsap: typeof GSAPType): GSAPAnimation {
  // TODO: Task 4.2
  return { kill: () => {} } as unknown as GSAPAnimation;
}

// Minimal type alias — replaced with proper GSAP types when implemented
type GSAPAnimation = { kill: () => void };
