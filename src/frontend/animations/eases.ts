/**
 * Named ease curves used across the portfolio.
 *
 * Centralizing eases here ensures visual consistency and makes global
 * timing changes trivial (one file to update).
 *
 * Usage:
 *   import { eases } from "@/frontend/animations/eases";
 *   gsap.to(el, { ease: eases.revealText });
 */

export const eases = {
  /** Primary reveal ease — most text/element entrances */
  reveal: "power3.out",

  /** Heavier ease for large elements (name, section titles) */
  revealHeavy: "power4.out",

  /** Snappy ease for interactive responses (hover, cursor) */
  snap: "power2.inOut",

  /** Soft ease for ambient/floating animations */
  ambient: "sine.inOut",

  /** Exit ease — elements leaving the viewport */
  exit: "power2.in",

  /** Technical blink (status indicators) */
  blink: "steps(1, end)",
} as const;

export type EaseName = keyof typeof eases;
