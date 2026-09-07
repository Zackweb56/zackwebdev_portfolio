"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/frontend/animations/gsap";

interface SmoothScrollProviderProps {
  children?: React.ReactNode;
}

/**
 * SmoothScrollProvider
 *
 * Establishes a luxury, cinematic slow-motion smooth scrolling momentum
 * across the entire portfolio using Lenis synchronized with GSAP ScrollTrigger.
 *
 * Features:
 *   - Custom exponential deceleration curve for heavy-inertia "slow motion" glide
 *   - Synchronized with GSAP's RAF ticker and ScrollTrigger.update
 *   - Honors prefers-reduced-motion for accessibility
 *   - Global hook-in for modal scroll suppression ([data-lenis-prevent])
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis with slow-motion inertia physics
    const lenis = new Lenis({
      duration: 1.6, // Longer duration for floating, deliberate slow-motion glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Controlled wheel delta for cinematic weight
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll updates with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Add Lenis RAF handling into GSAP ticker for unified animation frame timing
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Global reference for modal dialogs or imperative scroll navigation
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
