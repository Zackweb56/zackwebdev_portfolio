"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProjectMedia as ProjectMediaType } from "@/frontend/types/project";
import { ProjectMediaFallback } from "./ProjectMediaFallback";

interface ProjectMediaProps {
  media?: ProjectMediaType;
  title: string;
  evidenceId: string;
  category?: string;
  priority?: boolean;
  className?: string;
}

/**
 * ProjectMedia
 *
 * Handles project media rendering with robust fallback handling:
 *   - If image URL is present, renders Next.js Image with optimized sizes and contrast styling.
 *   - If image is missing or errors during load, renders the ProjectMediaFallback technical HUD blueprint.
 */
export function ProjectMedia({
  media,
  title,
  evidenceId,
  category = "FULLSTACK",
  priority = false,
  className = "",
}: ProjectMediaProps) {
  const [hasError, setHasError] = useState(false);

  // If no source is specified or an error occurred, render the technical HUD fallback
  if (!media?.src || hasError) {
    return (
      <ProjectMediaFallback
        title={title}
        evidenceId={evidenceId}
        category={category}
        variant={media?.fallbackVariant || "schematic"}
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full min-h-[220px] bg-[#050505] border border-white/10 overflow-hidden group ${className}`}
    >
      {/* 4 Corner Precision Brackets */}
      <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#FFAA00]/80 z-20" aria-hidden="true" />
      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#FFAA00]/80 z-20" aria-hidden="true" />
      <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#FFAA00]/80 z-20" aria-hidden="true" />
      <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#FFAA00]/80 z-20" aria-hidden="true" />

      {/* Actual Image */}
      <Image
        src={media.src}
        alt={media.alt || `${title} screenshot`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setHasError(true)}
        className="object-cover object-center grayscale contrast-110 group-hover:scale-103 group-hover:grayscale-0 transition-all duration-500"
      />

      {/* Subtle Evidence Badge Overlay */}
      <div className="absolute top-2.5 right-2.5 z-20 bg-black/80 px-2 py-0.5 border border-white/15 font-mono text-[0.55rem] text-[#FFAA00] tracking-widest uppercase">
        {evidenceId}
      </div>
    </div>
  );
}
