/**
 * ─── Motion Distance Vocabulary ──────────────────────────────────────────────
 *
 * Consistent movement distances for the portfolio's global motion language.
 *
 * Philosophy:
 *   Controlled and precise — not random pixel values scattered across files.
 *   Large editorial content moves further. Technical metadata barely moves.
 *   Movement reinforces hierarchy, not decoration.
 *
 * Motion hierarchy:
 *   MICRO  → Level 1 (cursor, status indicators)
 *   SMALL  → Level 2 (UI: labels, nav, metadata)
 *   MEDIUM → Level 3 (Content: headings, paragraphs, images)
 *   LARGE  → Level 4 (Cinematic: hero, section headers)
 *
 * Usage:
 *   import { distances } from "@/frontend/animations/distances";
 *   gsap.from(el, { y: distances.small });
 */

export const distances = {
  /**
   * Micro — barely perceptible movement.
   * For status dots, technical indicators, subtle feedback.
   * Level 1 motion.
   */
  micro: 4,

  /**
   * Small — crisp UI motion.
   * For labels, metadata, navigation items, technical elements.
   * Level 2 motion.
   */
  small: 12,

  /**
   * Medium — standard content reveal.
   * For body paragraphs, section metadata, project descriptions.
   * Level 3 motion.
   */
  medium: 24,

  /**
   * Large — editorial reveal.
   * For section headings, large display elements, image reveals.
   * Level 3–4 motion.
   */
  large: 48,

  /**
   * Cinematic — landmark entrances.
   * For hero name, loader exit, page-level transitions.
   * Level 4 motion. Use sparingly.
   */
  cinematic: 80,
} as const;

export type DistanceName = keyof typeof distances;
