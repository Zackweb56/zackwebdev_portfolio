"use client";

import React from "react";
import Link from "next/link";
import { ProjectLinks } from "@/frontend/types/project";
import { playSound } from "@/frontend/lib/sound";

interface ProjectLinkButtonsProps {
  links: ProjectLinks;
  size?: "sm" | "md";
  className?: string;
}

/**
 * ProjectLinkButtons
 *
 * Renders action buttons for available project links (Live Demo, GitHub, Case Study).
 * Automatically excludes non-existent links so no empty buttons are rendered.
 */
export function ProjectLinkButtons({
  links,
  size = "sm",
  className = "",
}: ProjectLinkButtonsProps) {
  const hasAnyLink =
    links.liveDemo || links.github || links.caseStudy || links.previewUrl;

  if (!hasAnyLink) return null;

  const btnPadding = size === "sm" ? "px-2.5 py-1 text-[0.65rem]" : "px-3.5 py-1.5 text-xs";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Case Study Link */}
      {links.caseStudy && (
        <Link
          href={links.caseStudy}
          onMouseEnter={() => playSound("hover")}
          onClick={() => playSound("click")}
          className={`inline-flex items-center gap-1.5 border border-[#FFAA00] bg-[#FFAA00]/10 hover:bg-[#FFAA00] hover:text-[#050505] text-[#FFAA00] font-mono font-semibold tracking-wider uppercase rounded-xs transition-all ${btnPadding}`}
        >
          <span>CASE STUDY</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      )}

      {/* Live Demo Link */}
      {links.liveDemo && (
        <a
          href={links.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => playSound("hover")}
          onClick={() => playSound("open")}
          className={`inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.03] hover:border-white/40 hover:text-white text-white/80 font-mono tracking-wider uppercase rounded-xs transition-all ${btnPadding}`}
        >
          <span>LIVE DEMO</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}

      {/* GitHub Repository Link */}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => playSound("hover")}
          onClick={() => playSound("open")}
          className={`inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.02] hover:border-white/30 hover:text-white text-white/70 font-mono tracking-wider uppercase rounded-xs transition-all ${btnPadding}`}
        >
          <span>SOURCE</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      )}
    </div>
  );
}
