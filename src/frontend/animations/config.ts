/**
 * GSAP global configuration
 *
 * All GSAP plugin registrations and global defaults live here.
 * Import this module ONCE, at the top level (layout or a client provider).
 *
 * DO NOT call gsap.registerPlugin() inside individual components.
 *
 * Plugins to register as they are implemented:
 *   - ScrollTrigger  (Phase 3, Task 3.4)
 *   - Flip           (if needed for project transitions)
 *   - Observer       (if needed for touch gesture handling)
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register core plugins
// Additional plugins registered here as each phase requires them
gsap.registerPlugin(ScrollTrigger);

// ─── Global defaults ─────────────────────────────────────────────────────────
gsap.defaults({
  ease: "power2.out",
  duration: 0.6,
});

// ─── ScrollTrigger global config ─────────────────────────────────────────────
ScrollTrigger.config({
  // Prevent ScrollTrigger from interfering with reduced-motion preference
  // (individual animations also check this — defense in depth)
  ignoreMobileResize: true,
});

export { gsap, ScrollTrigger };
