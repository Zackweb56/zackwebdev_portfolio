"use client";

import React, { useState, useRef, useCallback } from "react";
import { Project } from "@/frontend/types/project";
import { ProjectMediaFallback } from "./ProjectMediaFallback";
import { playSound } from "@/frontend/lib/sound";

interface ProjectGalleryCardProps {
  project: Project;
  index: number;
  /** "slider" cards are tall + portrait; "grid" cards are shorter landscape */
  variant?: "slider" | "grid";
  className?: string;
  onSelect?: (project: Project) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  fullstack: "FULL STACK",
  frontend: "FRONT END",
  backend: "BACK END",
  enterprise: "ENTERPRISE",
  system: "SYSTEM",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#FFAA00",
  "in-progress": "#44FF88",
  archived: "#666",
  concept: "#666",
};

/**
 * ProjectGalleryCard
 *
 * Portrait card for the projects gallery.
 *
 * DEFAULT (collapsed):
 *   - Full card is the media (HUD schematic fills everything)
 *   - Very bottom: subtle gradient → evidence label + project title only
 *   - No info clutter — pure image-first cinema aesthetic
 *
 * HOVER (expanded):
 *   - Active amber corner brackets
 *   - Media dims to reveal detail overlay rising from bottom
 *   - Evidence #, title, status, short description, tech badges, action links
 *   - "[ CLICK TO DECRYPT ]" secondary CTA hint
 */
export function ProjectGalleryCard({
  project,
  index,
  variant = "slider",
  className = "",
  onSelect,
}: ProjectGalleryCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    playSound("hover");
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (onSelect) {
        e.preventDefault();
        playSound("open");
        onSelect(project);
      }
    },
    [onSelect, project]
  );


  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const paddedIndex = String(index + 1).padStart(2, "0");
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category.toUpperCase();
  const statusColor = STATUS_COLORS[project.status] ?? "#666";

  const isSlider = variant === "slider";

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        width: isSlider ? "clamp(220px, 70vw, 280px)" : "100%",
        height: isSlider ? "clamp(340px, 75vw, 500px)" : "clamp(240px, 40vw, 320px)",
        flexShrink: isSlider ? 0 : undefined,
        border: hovered
          ? "1px solid rgba(255,170,0,0.55)"
          : "1px solid rgba(255,255,255,0.07)",
        background: "#050505",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered
          ? "0 0 28px rgba(255,170,0,0.1), 0 12px 48px rgba(0,0,0,0.7)"
          : "0 4px 20px rgba(0,0,0,0.5)",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="article"
      aria-label={`Project: ${project.title}`}
    >
      {/* ── 4 Corner Brackets — amber on hover, dim white default ── */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <span
          key={pos}
          className="absolute z-30 pointer-events-none"
          style={{
            width: 12,
            height: 12,
            top: pos.startsWith("t") ? 0 : "auto",
            bottom: pos.startsWith("b") ? 0 : "auto",
            left: pos.endsWith("l") ? 0 : "auto",
            right: pos.endsWith("r") ? 0 : "auto",
            borderTop: pos.startsWith("t")
              ? `2px solid ${hovered ? "#FFAA00" : "rgba(255,255,255,0.22)"}`
              : "none",
            borderBottom: pos.startsWith("b")
              ? `2px solid ${hovered ? "#FFAA00" : "rgba(255,255,255,0.22)"}`
              : "none",
            borderLeft: pos.endsWith("l")
              ? `2px solid ${hovered ? "#FFAA00" : "rgba(255,255,255,0.22)"}`
              : "none",
            borderRight: pos.endsWith("r")
              ? `2px solid ${hovered ? "#FFAA00" : "rgba(255,255,255,0.22)"}`
              : "none",
            transition: "border-color 0.3s ease",
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── FULL-HEIGHT MEDIA (always behind everything) ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
          filter: hovered ? "brightness(0.28) saturate(0.7)" : "brightness(0.72)",
        }}
      >
        <ProjectMediaFallback
          title={project.shortTitle ?? project.title}
          evidenceId={project.metadata.evidenceId}
          category={categoryLabel}
          variant={project.thumbnail.fallbackVariant ?? "schematic"}
          className="w-full h-full !min-h-0 !border-0 !p-0"
        />
      </div>

      {/* ── VERTICAL EVIDENCE LABEL (right edge, rotated — visible always) ── */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center pointer-events-none"
        style={{
          width: 22,
          opacity: hovered ? 0 : 0.6,
          transition: "opacity 0.25s ease",
        }}
        aria-hidden="true"
      >
        <span
          className="font-mono text-[0.52rem] tracking-[0.22em] uppercase whitespace-nowrap"
          style={{
            color: "#FFAA00",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {project.metadata.evidenceId}
        </span>
      </div>

      {/* ── COLLAPSED BOTTOM: Evidence + Title ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 50%, transparent 100%)",
          paddingTop: "3rem",
          opacity: hovered ? 0 : 1,
          transform: hovered ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        <span
          className="block font-mono text-[0.58rem] tracking-[0.2em] mb-1"
          style={{ color: "#FFAA00" }}
        >
          EVIDENCE #{paddedIndex}
        </span>
        <h3
          className="font-sans font-bold text-white leading-tight"
          style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.2rem)" }}
        >
          {project.shortTitle ?? project.title}
        </h3>
      </div>

      {/* ── EXPANDED HOVER OVERLAY ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end px-3 pb-3 pt-4"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        {/* Evidence + title */}
        <div className="mb-2">
          <span
            className="block font-mono text-[0.56rem] tracking-[0.22em] mb-0.5"
            style={{ color: "#FFAA00" }}
          >
            {project.metadata.evidenceId} · {project.metadata.year}
          </span>
          <h3
            className="font-sans font-bold text-white leading-snug"
            style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.1rem)" }}
          >
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColor, boxShadow: `0 0 4px ${statusColor}` }}
            />
            <span
              className="font-mono text-[0.52rem] tracking-widest uppercase"
              style={{ color: statusColor }}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Short description */}
        <p
          className="font-sans leading-relaxed mb-2.5 line-clamp-2"
          style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.55)" }}
        >
          {project.shortDescription}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, isSlider ? 4 : 6).map((tech) => (
            <span
              key={tech.name}
              className="font-mono text-[0.5rem] px-1.5 py-0.5 tracking-[0.08em] uppercase"
              style={{
                border: tech.highlight
                  ? "1px solid rgba(255,170,0,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
                color: tech.highlight ? "#FFAA00" : "rgba(255,255,255,0.4)",
                background: tech.highlight ? "rgba(255,170,0,0.06)" : "transparent",
              }}
              onMouseEnter={() => playSound("hover")}
            >
              {tech.name}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-2.5" style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

        {/* CTA row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) {
                playSound("open");
                onSelect(project);
              }
            }}
            className="flex-1 text-center font-mono text-[0.56rem] tracking-[0.16em] uppercase py-1.5 transition-all duration-200 cursor-pointer"
            style={{ background: "#FFAA00", color: "#050505", fontWeight: 700 }}
            onMouseEnter={() => playSound("hover")}
            aria-label={`Open project details for ${project.title}`}
          >
            [ CASE STUDY ]
          </button>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-1.5 font-mono text-[0.56rem] tracking-widest uppercase transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={(e) => {
                playSound("hover");
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,170,0,0.4)";
                (e.currentTarget as HTMLElement).style.color = "#FFAA00";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
              onClick={() => playSound("click")}
              aria-label="GitHub"
            >
              GH
            </a>
          )}
        </div>

        {/* Decrypt hint */}
        {project.links.caseStudy && (
          <div className="mt-1.5 text-center">
            <span
              className="font-mono text-[0.5rem] tracking-[0.18em] uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              [ CLICK TO DECRYPT ]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
