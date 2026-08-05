"use client";

import { useEffect, useState, useRef } from "react";

/**
 * useActiveSection
 *
 * Tracks which portfolio section is currently in the viewport.
 * Used by the fixed navigation to highlight the active section indicator.
 *
 * Observes section elements by their IDs.
 * Implemented fully in Task 2.3 (section indicator) and Task 2.1 (navigation).
 */

export type SectionId = "hero" | "profile" | "projects" | "contact";

const SECTION_IDS: SectionId[] = ["hero", "profile", "projects", "contact"];

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observerRef.current!.observe(section));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return activeSection;
}
