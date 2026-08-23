"use client";

import React from "react";
import { ProjectTechnology } from "@/frontend/types/project";
import { playSound } from "@/frontend/lib/sound";

interface ProjectTechListProps {
  technologies: ProjectTechnology[];
  maxVisible?: number;
  interactive?: boolean;
  className?: string;
}

/**
 * ProjectTechList
 *
 * Renders technology badges for project cards and detail views.
 * Supports interactive audio hover state when enabled.
 */
export function ProjectTechList({
  technologies,
  maxVisible,
  interactive = true,
  className = "",
}: ProjectTechListProps) {
  const visibleList = maxVisible
    ? technologies.slice(0, maxVisible)
    : technologies;
  const remainingCount = maxVisible ? technologies.length - maxVisible : 0;

  return (
    <ul
      className={`flex flex-wrap gap-1.5 ${className}`}
      aria-label="Project technologies"
    >
      {visibleList.map((tech) => (
        <li key={tech.name}>
          <span
            onMouseEnter={interactive ? () => playSound("hover") : undefined}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[0.65rem] tracking-wide rounded-xs transition-colors select-none ${
              tech.highlight
                ? "border-[#FFAA00]/40 bg-[#FFAA00]/10 text-[#FFAA00]"
                : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${
                tech.highlight ? "bg-[#FFAA00]" : "bg-white/40"
              }`}
              aria-hidden="true"
            />
            <span>{tech.name}</span>
          </span>
        </li>
      ))}

      {remainingCount > 0 && (
        <li>
          <span className="inline-flex items-center px-1.5 py-0.5 border border-white/5 font-mono text-[0.6rem] text-white/40 rounded-xs">
            +{remainingCount}
          </span>
        </li>
      )}
    </ul>
  );
}
