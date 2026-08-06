"use client";

import React, { useRef } from "react";
import { useGSAP } from "@/frontend/hooks/useGSAP";
import { revealFade, revealUp, revealClip, prefersReducedMotion, setVisible } from "@/frontend/animations/utils";
import { durations } from "@/frontend/animations/durations";
import { distances } from "@/frontend/animations/distances";
import { eases } from "@/frontend/animations/eases";
import { createScrollTrigger, createTimeline } from "@/frontend/animations/utils";

/**
 * RevealVariant
 *
 * The three core reveal types from the global motion language:
 *
 *   fade  → opacity only (Level 2 — UI metadata)
 *   up    → opacity + translate-up (Level 3 — standard content)
 *   clip  → clip-path reveal (Level 4 — editorial/cinematic)
 */
type RevealVariant = "fade" | "up" | "clip";

/**
 * RevealTrigger
 *
 *   scroll  → Triggers when element enters the viewport (default)
 *   mount   → Triggers immediately on component mount
 */
type RevealTrigger = "scroll" | "mount";

interface RevealProps {
  /** Animation variant — controls the motion style */
  variant?: RevealVariant;

  /** When to trigger the animation */
  trigger?: RevealTrigger;

  /** Animation duration in seconds */
  duration?: number;

  /** Delay before animation starts in seconds */
  delay?: number;

  /** Vertical distance for "up" variant in pixels */
  distance?: number;

  /** ScrollTrigger start position (CSS string) */
  start?: string;

  /** Direction for "clip" variant */
  direction?: "up" | "down" | "left" | "right";

  /** HTML element to render the wrapper as */
  as?: React.ElementType;

  /** Additional class names */
  className?: string;

  /** Accessible: aria-label for the reveal container */
  "aria-label"?: string;

  children: React.ReactNode;
}

/**
 * Reveal
 *
 * A reusable scroll-triggered (or mount-triggered) animation wrapper.
 *
 * This is the primary way future sections should animate content into view.
 * It wraps a GSAP animation inside useGSAP() for safe lifecycle management.
 *
 * Usage:
 *   // Fade metadata in when scrolled into view
 *   <Reveal variant="fade">
 *     <TechnicalMetadata label="ROLE" value="Full Stack Dev" />
 *   </Reveal>
 *
 *   // Slide heading up on scroll
 *   <Reveal variant="up" delay={0.2}>
 *     <h2>Profile</h2>
 *   </Reveal>
 *
 *   // Cinematic clip reveal for hero title (mount trigger)
 *   <Reveal variant="clip" trigger="mount" duration={0.75}>
 *     <h1>Zakariyae Boughaba</h1>
 *   </Reveal>
 *
 * Reduced motion:
 *   The element becomes immediately visible. No opacity flash.
 *   Content is always accessible regardless of animation state.
 *
 * Accessibility:
 *   - Element is in the DOM and accessible tree before animation plays
 *   - Works with keyboard navigation and screen readers
 *   - Content is never permanently hidden by GSAP
 *
 * @param variant   "fade" | "up" | "clip" (default: "up")
 * @param trigger   "scroll" | "mount" (default: "scroll")
 */
export function Reveal({
  variant = "up",
  trigger = "scroll",
  duration,
  delay = 0,
  distance = distances.medium,
  start = "top 88%",
  direction = "up",
  as: Tag = "div",
  className,
  "aria-label": ariaLabel,
  children,
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // If reduced motion is set, make immediately visible and skip animation
      if (prefersReducedMotion()) {
        setVisible(el);
        return;
      }

      // Build the animation timeline (paused — we'll play it via scroll or mount)
      let tl = createTimeline({ paused: true });

      switch (variant) {
        case "fade":
          tl = revealFade(el, {
            duration: duration ?? durations.fast,
            delay,
            ease: eases.ui.enter,
            paused: true,
          });
          break;

        case "clip":
          tl = revealClip(el, {
            duration: duration ?? durations.slow,
            delay,
            direction,
            paused: true,
          });
          break;

        case "up":
        default:
          tl = revealUp(el, {
            duration: duration ?? durations.normal,
            delay,
            distance,
            paused: true,
          });
          break;
      }

      if (trigger === "mount") {
        // Play immediately on component mount
        tl.play();
      } else {
        // Trigger when element scrolls into viewport
        createScrollTrigger({
          trigger: el,
          animation: tl,
          start,
          once: true,
          onEnter: () => tl.play(),
        });
      }
    },
    { scope: containerRef, dependencies: [variant, trigger] }
  );

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}
