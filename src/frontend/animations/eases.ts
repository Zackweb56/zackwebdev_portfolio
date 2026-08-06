/**
 * ─── Motion Easing Vocabulary ────────────────────────────────────────────────
 *
 * Named ease curves organized by intent, not by GSAP internal names.
 *
 * Philosophy:
 *   Every ease name communicates what kind of motion it produces.
 *   A developer reading `eases.contentEnter` immediately understands the role —
 *   unlike `"power4.out"` which communicates nothing about intent.
 *
 * Motion Character:
 *   Fast response → smooth deceleration.
 *   No bounce. No overshoot. No elastic. This is a technical editorial portfolio.
 *   Motion reinforces credibility, not playfulness.
 *
 * Motion Hierarchy mapping:
 *   Level 1 — MICRO:     ui.enter / ui.exit
 *   Level 2 — UI:        ui.enter / ui.exit
 *   Level 3 — CONTENT:   content.enter / content.exit
 *   Level 4 — CINEMATIC: cinematic.enter / cinematic.exit
 *
 * Usage:
 *   import { eases } from "@/frontend/animations/eases";
 *   gsap.from(el, { ease: eases.content.enter });
 *   gsap.to(el, { ease: eases.ui.exit });
 */

/**
 * eases
 *
 * Organized by motion hierarchy level and direction (enter/exit).
 * Access via: eases.ui.enter, eases.content.enter, etc.
 */
export const eases = {
  /**
   * UI motion (Level 1–2)
   * For: cursor states, button hover, nav items, labels, metadata, indicators.
   * Character: Crisp and snappy. Feels like a precision instrument responding.
   */
  ui: {
    /** UI element entering (hover in, label appearing, indicator activating) */
    enter: "power2.out",
    /** UI element exiting (hover out, label disappearing) */
    exit: "power2.in",
    /** Bidirectional UI toggle (active ↔ inactive state) */
    toggle: "power2.inOut",
  },

  /**
   * Content motion (Level 3)
   * For: headings, paragraphs, images, project cards, section metadata.
   * Character: Controlled deceleration — element slides in with authority.
   */
  content: {
    /** Content entering viewport (scroll reveal, section entrance) */
    enter: "power3.out",
    /** Content exiting viewport (page leave, section exit) */
    exit: "power3.in",
  },

  /**
   * Cinematic motion (Level 4)
   * For: hero name reveal, loader exit, page transitions, landmark moments.
   * Character: Heavy deceleration — feels significant and intentional.
   * Reserve for 1–2 moments per page maximum.
   */
  cinematic: {
    /** Major reveal — hero, loader, full-page entrance */
    enter: "power4.out",
    /** Major exit — page leave, project open transition */
    exit: "power4.in",
  },

  /**
   * Specialty eases
   * For specific technical or decorative purposes.
   */
  specialty: {
    /**
     * Ambient — slow sinusoidal breathing.
     * For: subtle floating elements, scanner lines, very gentle continuous motion.
     * Use sparingly — avoid making the page feel restless.
     */
    ambient: "sine.inOut",

    /**
     * Linear — constant velocity, no ease.
     * For: scroll-scrub animations, progress bars, uniform movement.
     */
    linear: "none",

    /**
     * Blink — stepped instant change.
     * For: technical status indicators, cursor blink, system pulses.
     */
    blink: "steps(1, end)",

    /**
     * Clip — for clip-path and mask reveals.
     * Slightly more aggressive deceleration to make reveals feel precise.
     */
    clip: "power3.out",
  },
} as const;

/**
 * @deprecated
 * Flat access for backwards compatibility with Task 7 code.
 * Prefer eases.ui.enter, eases.content.enter etc.
 */
export const legacyEases = {
  reveal: eases.content.enter,
  revealHeavy: eases.cinematic.enter,
  snap: eases.ui.toggle,
  ambient: eases.specialty.ambient,
  exit: eases.ui.exit,
  blink: eases.specialty.blink,
} as const;

export type UIEaseName = keyof typeof eases.ui;
export type ContentEaseName = keyof typeof eases.content;
export type CinematicEaseName = keyof typeof eases.cinematic;
export type SpecialtyEaseName = keyof typeof eases.specialty;

/** Union of all ease category names */
export type EaseCategory = keyof typeof eases;
