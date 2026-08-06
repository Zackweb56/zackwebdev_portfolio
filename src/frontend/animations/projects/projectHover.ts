/**
 * ─── Project Card Hover Animations ───────────────────────────────────────────
 *
 * Hover interaction for individual project cards.
 *
 * Phases (implemented in Projects task):
 *   1. Image scale       — subtle scale up on hover
 *   2. Amber border      — border opacity + color transition
 *   3. Title reveal      — clip-path or opacity shift
 *   4. Metadata move     — small y-translate on tech labels
 *   5. Case number       — amber glow activation
 *
 * Architecture:
 *   Each card component initialises its own hover animation.
 *   Uses gsap.quickTo() for smooth pointer-tracking effects.
 *   Cleanup via GSAP context (useGSAP scope).
 */

export interface ProjectCardRefs {
  card: HTMLElement | null;
  image: HTMLElement | null;
  title: HTMLElement | null;
  metadata: HTMLElement | null;
  caseNumber: HTMLElement | null;
}

/**
 * initProjectHover
 *
 * Registers hover enter/leave handlers on the card element.
 * Must be called inside useGSAP() — cleanup is automatic.
 */
export function initProjectHover(_refs: ProjectCardRefs): void {
  // TODO: Projects task implementation
  // 1. prefersReducedMotion() guard
  // 2. Create hover-in timeline (paused)
  // 3. Create hover-out timeline (paused)
  // 4. Add mouseenter/mouseleave listeners on refs.card
  // 5. Listeners play the respective timeline
  // NOTE: Do NOT add removeEventListener manually — gsap.context() handles it
}
