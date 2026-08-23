"use client";

import React from "react";
import { Project } from "@/frontend/types/project";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectTechList } from "./ProjectTechList";
import { ProjectLinkButtons } from "./ProjectLinkButtons";

export type CardVisualState = "default" | "hover" | "active" | "open";

interface ProjectCardPrimitiveProps {
  project: Project;
  state?: CardVisualState;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  showDetails?: boolean;
  className?: string;
}

/**
 * ProjectCardPrimitive
 *
 * Base presentation card primitive for the Projects subsystem.
 * Encapsulates the visual identity:
 *   - Sharp corners with 4 precision brackets
 *   - Dark `#050505` background with fine borders
 *   - Visual state transitions (`default`, `hover`, `active`, `open`)
 *   - Integrated media/fallback rendering
 *   - Semantic markup with keyboard access
 */
export function ProjectCardPrimitive({
  project,
  state = "default",
  onClick,
  onHoverStart,
  onHoverEnd,
  showDetails = true,
  className = "",
}: ProjectCardPrimitiveProps) {
  const isSelected = state === "active" || state === "open";

  return (
    <article
      data-project-id={project.id}
      data-project-slug={project.slug}
      data-state={state}
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={`relative border bg-[#050505]/90 flex flex-col justify-between transition-all duration-300 ${
        isSelected
          ? "border-[#FFAA00] shadow-[0_0_20px_rgba(255,170,0,0.12)]"
          : "border-white/10 hover:border-white/25"
      } ${className}`}
    >
      {/* ── 4 Precision Corner Brackets ── */}
      <span
        className={`absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 transition-colors z-20 ${
          isSelected ? "border-[#FFAA00]" : "border-white/30"
        }`}
        aria-hidden="true"
      />
      <span
        className={`absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 transition-colors z-20 ${
          isSelected ? "border-[#FFAA00]" : "border-white/30"
        }`}
        aria-hidden="true"
      />
      <span
        className={`absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 transition-colors z-20 ${
          isSelected ? "border-[#FFAA00]" : "border-white/30"
        }`}
        aria-hidden="true"
      />
      <span
        className={`absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 transition-colors z-20 ${
          isSelected ? "border-[#FFAA00]" : "border-white/30"
        }`}
        aria-hidden="true"
      />

      {/* ── Top Header Bar ── */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between font-mono text-[0.625rem]">
        <div className="flex items-center gap-2">
          <span className="text-[#FFAA00] font-bold">{project.metadata.evidenceId}</span>
          <span className="text-white/30">/</span>
          <span className="text-white/50 uppercase">{project.category}</span>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* ── Center Media Frame ── */}
      <div className="relative w-full aspect-[16/9] border-b border-white/10 overflow-hidden">
        <ProjectMedia
          media={project.thumbnail}
          title={project.title}
          evidenceId={project.metadata.evidenceId}
          category={project.category}
        />
      </div>

      {/* ── Content Body ── */}
      <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans font-bold text-base sm:text-lg text-white group-hover:text-[#FFAA00] transition-colors leading-snug">
              {project.title}
            </h3>
            <span className="font-mono text-[0.65rem] text-white/40">{project.metadata.year}</span>
          </div>

          <p className="font-sans text-xs text-white/60 leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        {showDetails && (
          <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
            <ProjectTechList technologies={project.technologies} maxVisible={4} />
            <ProjectLinkButtons links={project.links} />
          </div>
        )}
      </div>
    </article>
  );
}
