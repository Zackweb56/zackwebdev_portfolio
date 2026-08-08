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
 *   This file is safe to import at module level. Plugin registration and
 *   ScrollTrigger configuration are guarded to browser environment only.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guard plugin registration & config for browser runtime only (SSR safe)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // ─── Global defaults ──────────────────────────────────────────────────────────
  gsap.defaults({
    ease: "power3.out",    // precise reveal ease — matches portfolio's editorial tone
    duration: 0.45,        // durations.normal — standard element reveal
  });

  // ─── ScrollTrigger global config ─────────────────────────────────────────────
  ScrollTrigger.config({
    // Suppress resize events on mobile address bar show/hide
    ignoreMobileResize: true,

    // Disable automatic refresh on DOMContentLoaded — we control refresh manually
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

// Re-export so all animation modules use a single import point
export { gsap, ScrollTrigger };
