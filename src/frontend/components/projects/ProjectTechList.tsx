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

const CATEGORY_STYLES: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  frontend: {
    border: "border-blue-500/30 hover:border-blue-500/50",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  backend: {
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  database: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  tools: {
    border: "border-purple-500/30 hover:border-purple-500/50",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  devops: {
    border: "border-purple-500/30 hover:border-purple-500/50",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  other: {
    border: "border-white/10 hover:border-white/30",
    bg: "bg-white/[0.03]",
    text: "text-white/70 hover:text-white",
    dot: "bg-white/40",
  },
};

/**
 * ProjectTechList
 *
 * Renders technology badges for project cards and detail views.
 * Supports interactive audio hover state when enabled with category color accents.
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
      {visibleList.map((tech) => {
        const cat = tech.category || "other";
        const catStyle = CATEGORY_STYLES[cat] || CATEGORY_STYLES.other;

        return (
          <li key={tech.name}>
            <span
              onMouseEnter={interactive ? () => playSound("hover") : undefined}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[0.65rem] tracking-wide rounded-xs transition-colors select-none ${
                tech.highlight
                  ? "border-[#FFAA00]/50 bg-[#FFAA00]/15 text-[#FFAA00] shadow-[0_0_8px_rgba(255,170,0,0.15)]"
                  : `${catStyle.border} ${catStyle.bg} ${catStyle.text}`
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  tech.highlight ? "bg-[#FFAA00]" : catStyle.dot
                }`}
                aria-hidden="true"
              />
              <span>{tech.name}</span>
            </span>
          </li>
        );
      })}

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
