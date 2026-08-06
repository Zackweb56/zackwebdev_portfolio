/**
 * ─── GSAP Entry Point ────────────────────────────────────────────────────────
 *
 * This is the SINGLE place where GSAP is imported and configured.
 *
 * Rules:
 *   ✓ Import `gsap` and `ScrollTrigger` from HERE — not directly from "gsap"
 *   ✗ Never call gsap.registerPlugin() inside a component
 *   ✗ Never import ScrollTrigger directly in a component
 *
 * Example usage in animation modules:
 *   import { gsap, ScrollTrigger } from "@/frontend/animations/gsap";
 *
 * Example usage in React components (use the hook instead):
 *   import { useGSAP } from "@/frontend/hooks/useGSAP";
 *
 * SSR Safety:
 *   This file is safe to import at module level. GSAP performs its own
 *   environment detection. Plugin registration is a no-op on the server.
 *   Actual animations only run inside useEffect / event handlers where
 *   the browser environment is guaranteed.
 *
 * Plugins registered here:
 *   ✓ ScrollTrigger — used for section reveals (Profile, Projects, Contact)
 *
 * Plugins NOT registered (add here when needed):
 *   - Flip     — if project card transitions require FLIP animation
 *   - Observer — if touch gesture scroll handling is needed
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once at module evaluation time.
// Safe to call multiple times — GSAP deduplicates registrations internally.
gsap.registerPlugin(ScrollTrigger);

// ─── Global defaults ──────────────────────────────────────────────────────────
// These are the fallback values for all GSAP tweens in this project.
// Feature animations should provide explicit values where they differ.
gsap.defaults({
  ease: "power3.out",    // precise reveal ease — matches portfolio's editorial tone
  duration: 0.45,        // durations.normal — standard element reveal
});

// ─── ScrollTrigger global config ─────────────────────────────────────────────
ScrollTrigger.config({
  // Suppress resize events on mobile address bar show/hide
  // (prevents false triggers when user scrolls)
  ignoreMobileResize: true,

  // Disable automatic refresh on DOMContentLoaded — we control refresh manually
  // if needed during route changes
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

// Re-export so all animation modules use a single import point
export { gsap, ScrollTrigger };
