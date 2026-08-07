/**
 * ─── Flashlight Animation Integration ─────────────────────────────────────────
 *
 * GSAP helpers & constants for the Global Flashlight / Inspection Light system.
 *
 * Architecture:
 *   - The main flashlight rendering & smooth tracking loop is driven by the
 *     `<Flashlight />` Client Component (`src/frontend/components/flashlight/Flashlight.tsx`).
 *   - This module provides helpers for programmatic animation or configuration
 *     when GSAP timelines interact with the flashlight.
 */

import { gsap } from "@/frontend/animations/gsap";

export interface FlashlightRefs {
  flashlight: HTMLElement | null;
}

/**
 * pulseFlashlight
 *
 * Temporarily brightens the flashlight core during a landmark reveal or user action.
 */
export function pulseFlashlight(el: HTMLElement | null): void {
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 0.95, opacity: 0.7 },
    { scale: 1.15, opacity: 1, duration: 0.4, ease: "power2.out", yoyo: true, repeat: 1 }
  );
}
