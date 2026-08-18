/**
 * ─── Profile Reveal Animations ───────────────────────────────────────────────
 *
 * Scroll-triggered reveal sequence for the Profile section — Task 13.
 *
 * Architecture:
 *   - Uses GSAP ScrollTrigger
 *   - Staggers the 3 primary dossier column cards as they enter view
 *   - Respects `prefers-reduced-motion` for accessibility
 */

import { gsap } from "@/frontend/animations/gsap";
import { createTimeline, prefersReducedMotion, setVisible } from "@/frontend/animations/utils";
import { durations } from "@/frontend/animations/durations";
import { eases } from "@/frontend/animations/eases";
import { distances } from "@/frontend/animations/distances";
import type { GSAPTimeline } from "@/frontend/animations/types";

export interface ProfileAnimationRefs {
  container: HTMLElement | null;
  header: HTMLElement | null;
  cards: HTMLElement[];
}

/**
 * buildProfileReveal
 *
 * Creates a ScrollTriggered GSAP timeline that reveals the Profile dossier
 * sequentially as it enters the viewport.
 */
export function buildProfileReveal(refs: ProfileAnimationRefs): GSAPTimeline | null {
  const { container, header, cards } = refs;

  if (!container) return null;

  // ─── Reduced Motion Guard ──────────────────────────────────────────────────
  if (prefersReducedMotion()) {
    const allEls = [header, ...cards].filter(Boolean) as HTMLElement[];
    setVisible(allEls);
    return null;
  }

  // ─── Pre-animation Setup (Hidden initial state) ───────────────────────────
  if (header) gsap.set(header, { opacity: 0, y: -distances.small });
  if (cards.length > 0) gsap.set(cards, { opacity: 0, y: distances.medium });

  // ─── Master ScrollTrigger Timeline ─────────────────────────────────────────
  const tl = createTimeline({
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      once: true,
    },
  });

  // 1. Header & Section identifier
  if (header) {
    tl.to(header, {
      opacity: 1,
      y: 0,
      duration: durations.normal,
      ease: eases.ui.enter,
    });
  }

  // 2. 3 Dossier Cards (Staggered Entrance)
  if (cards.length > 0) {
    tl.to(
      cards,
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: durations.slow,
        ease: eases.content.enter,
      },
      "-=0.15"
    );
  }

  return tl;
}
