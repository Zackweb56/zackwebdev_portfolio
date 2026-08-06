/**
 * ─── Contact Form Reveal ─────────────────────────────────────────────────────
 *
 * Scroll-triggered reveal for the Contact section.
 *
 * Phases (implemented in Contact task):
 *   1. Section label    — fade up
 *   2. Form fields      — staggered reveal
 *   3. Submit button    — scale entrance
 *   4. Social links     — staggered fade
 */

import type { GSAPTimeline } from "@/frontend/animations/types";

export interface ContactRefs {
  container: HTMLElement | null;
  label: HTMLElement | null;
  fields: HTMLElement[];
  submitBtn: HTMLElement | null;
  socialLinks: HTMLElement[];
}

/**
 * buildFormReveal
 *
 * Sets up scroll-triggered reveal for the contact form.
 * Must be called inside useGSAP() — cleanup is automatic.
 */
export function buildFormReveal(_refs: ContactRefs): GSAPTimeline | null {
  // TODO: Contact task implementation
  return null;
}
