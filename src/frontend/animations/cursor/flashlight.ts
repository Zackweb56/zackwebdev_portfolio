/**
 * ─── Flashlight / Cursor Radial Effect ──────────────────────────────────────
 *
 * Pointer-following radial light effect layered over the dark background.
 *
 * Architecture (implemented in Flashlight task):
 *   Uses gsap.quickTo() for performant, inertia-following position updates.
 *   The flashlight element is an absolutely positioned radial gradient div.
 *   CSS handles the visual — GSAP handles the position.
 *
 * quickTo example:
 *   const xTo = gsap.quickTo(flashlightEl, "x", { duration: 0.6, ease: "power3" });
 *   const yTo = gsap.quickTo(flashlightEl, "y", { duration: 0.6, ease: "power3" });
 *   window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
 *
 * Disabled automatically when:
 *   - prefers-reduced-motion is set
 *   - pointer is not fine (touch devices)
 */

export interface FlashlightRefs {
  flashlight: HTMLElement | null;
}

/**
 * initFlashlight
 *
 * Registers the mousemove handler and sets up quickTo tracking.
 * Returns a destroy function for cleanup.
 */
export function initFlashlight(_refs: FlashlightRefs): () => void {
  // TODO: Flashlight task implementation
  // 1. prefersReducedMotion() / pointer:fine guard
  // 2. const xTo = gsap.quickTo(refs.flashlight, "x", ...)
  // 3. const yTo = gsap.quickTo(refs.flashlight, "y", ...)
  // 4. window.addEventListener("mousemove", handler)
  // 5. Return () => window.removeEventListener("mousemove", handler)
  return () => {};
}

/**
 * destroyFlashlight
 *
 * Explicit cleanup for the flashlight if not using the returned destroy fn.
 */
export function destroyFlashlight(): void {
  // TODO: Flashlight task implementation
}
