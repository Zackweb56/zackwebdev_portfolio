/**
 * ─── Animation Architecture — Public API ─────────────────────────────────────
 *
 * This barrel export provides clean access to the animation foundation.
 *
 * Usage in React components:
 *   import { useGSAP } from "@/frontend/hooks/useGSAP";          // React hook
 *   import { durations, eases } from "@/frontend/animations";    // Constants
 *   import { createTimeline, fadeReveal } from "@/frontend/animations"; // Utils
 *
 * Usage in feature animation modules:
 *   import { gsap, ScrollTrigger } from "@/frontend/animations/gsap";  // GSAP instance
 *   import { createTimeline, prefersReducedMotion } from "@/frontend/animations/utils";
 *
 * Architecture rule:
 *   ✓ Components use useGSAP() from "@/frontend/hooks/useGSAP"
 *   ✓ Feature animations import gsap from "@/frontend/animations/gsap"
 *   ✓ Types are imported from "@/frontend/animations/types"
 *   ✗ Do NOT import directly from "gsap" in components
 *   ✗ Do NOT call gsap.registerPlugin() outside of gsap.ts
 */

// ─── Constants ────────────────────────────────────────────────────────────────
export { eases } from "./eases";
export type { EaseName } from "./eases";

export { durations } from "./durations";
export type { DurationName } from "./durations";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  GSAPTimeline,
  GSAPTween,
  GSAPScrollTrigger,
  GSAPContext,
  AnimationTarget,
  BaseAnimationOptions,
  StaggerConfig,
  BreakpointKey,
} from "./types";
export { breakpoints, staggerPresets } from "./types";

// ─── Utilities ────────────────────────────────────────────────────────────────
export {
  prefersReducedMotion,
  createTimeline,
  killTimeline,
  fadeReveal,
  setVisible,
  setHidden,
  createScrollTrigger,
} from "./utils";
