"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/frontend/types/project";
import { ProjectMediaFallback } from "./ProjectMediaFallback";
import { getAdjacentProjects } from "@/frontend/lib/projects/registry";
import { playSound } from "@/frontend/lib/sound";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (slug: string, direction: number) => void;
  direction?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  fullstack: "Full Stack",
  frontend: "Front End",
  backend: "Back End",
  enterprise: "Enterprise",
  system: "System",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#FFAA00",
  "in-progress": "#44FF88",
  archived: "#888888",
  concept: "#888888",
};

const TECH_CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
  architecture: "Architecture",
  other: "Other",
};

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onNavigate,
  direction = 1,
}: ProjectDetailModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playSound("click");
        onClose();
      } else if (e.key === "ArrowLeft" && project) {
        const { previous } = getAdjacentProjects(project.slug);
        if (previous) {
          playSound("click");
          onNavigate(previous.slug, -1);
        }
      } else if (e.key === "ArrowRight" && project) {
        const { next } = getAdjacentProjects(project.slug);
        if (next) {
          playSound("click");
          onNavigate(next.slug, 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock background body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, project, onClose, onNavigate]);

  if (!isOpen || !project) return null;

  const { previous, next } = getAdjacentProjects(project.slug);
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category;
  const statusColor = STATUS_COLORS[project.status] ?? "#FFAA00";

  // Group technologies by category
  const techByCategory = project.technologies.reduce(
    (acc, tech) => {
      const cat = tech.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tech);
      return acc;
    },
    {} as Record<string, typeof project.technologies>
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={`Project details for ${project.title}`}
      >
        {/* ── Backdrop with Blur & Zoom Out Effect ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => {
            playSound("click");
            onClose();
          }}
          className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl"
        />

        {/* ── Top HUD Header Bar (positioned below global navbar with clean breathing space) ── */}
        <div className="absolute top-14 sm:top-16 left-0 right-0 z-50 px-4 sm:px-8 py-2.5 flex items-center justify-between border-b border-white/10 bg-[#050505]/90 backdrop-blur-md pointer-events-none">
          {/* Left Telemetry */}
          <div className="flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.2em] text-white/40 pointer-events-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFAA00] animate-pulse" />
            <span className="text-[#FFAA00] font-semibold">{project.metadata.evidenceId}</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-white/40">SIGNAL_STRONG</span>
          </div>

          {/* Center Close Button [CLOSE TERMINAL [ESC]] */}
          <button
            onClick={() => {
              playSound("click");
              onClose();
            }}
            onMouseEnter={() => playSound("hover")}
            className="pointer-events-auto group px-4 py-1.5 font-mono text-[0.68rem] tracking-[0.2em] uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg"
            style={{
              border: "1px solid rgba(255, 170, 0, 0.4)",
              background: "rgba(255, 170, 0, 0.08)",
              color: "#FFAA00",
            }}
          >
            <span>CLOSE TERMINAL [ESC]</span>
            <span className="text-white/40 group-hover:text-[#FFAA00] transition-colors">✕</span>
          </button>

          {/* Right Status */}
          <div className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/40 pointer-events-auto">
            <span className="text-white/60">SYS_DIAGNOSTIC</span>
            <span className="text-[#44FF88]">[STABLE]</span>
          </div>
        </div>

        {/* ── Left Floating Arrow Button (<) ── */}
        {previous && (
          <button
            onClick={() => {
              playSound("click");
              onNavigate(previous.slug, -1);
            }}
            onMouseEnter={() => playSound("hover")}
            aria-label={`Previous project: ${previous.title}`}
            className="hidden md:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 items-center justify-center border border-white/15 hover:border-[#FFAA00] bg-[#0c0c0c]/85 hover:bg-[#FFAA00]/10 text-white/70 hover:text-[#FFAA00] transition-all duration-200 shadow-xl backdrop-blur-md cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* ── Right Floating Arrow Button (>) ── */}
        {next && (
          <button
            onClick={() => {
              playSound("click");
              onNavigate(next.slug, 1);
            }}
            onMouseEnter={() => playSound("hover")}
            aria-label={`Next project: ${next.title}`}
            className="hidden md:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 items-center justify-center border border-white/15 hover:border-[#FFAA00] bg-[#0c0c0c]/85 hover:bg-[#FFAA00]/10 text-white/70 hover:text-[#FFAA00] transition-all duration-200 shadow-xl backdrop-blur-md cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* ── Full Modal Content Window with Default Browser Scrollbar & Fixed Sidebar ── */}
        <motion.div
          key={project.slug}
          initial={{
            opacity: 0,
            scale: 0.94,
            x: direction === 1 ? 60 : direction === -1 ? -60 : 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.94,
            x: direction === 1 ? -60 : direction === -1 ? 60 : 0,
          }}
          transition={{
            duration: 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-40 w-full max-w-6xl max-h-[calc(100vh-7.5rem)] mt-24 sm:mt-28 overflow-y-auto px-4 sm:px-8 py-6 select-text"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ══════════════════════════════════════════════════════════════
                4-COLUMN LEFT METADATA SIDEBAR (FIXED / STICKY WHILE SCROLLING)
            ══════════════════════════════════════════════════════════════ */}
            <aside className="lg:col-span-4 lg:sticky lg:top-0 self-start flex flex-col gap-6">
              <div
                className="relative bg-[#0c0c0c]/95 border border-white/15 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 0 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.02)",
                }}
              >
                {/* 4 Corner HUD Reticles */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFAA00]" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFAA00]" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFAA00]" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFAA00]" />

                {/* Section Header: METADATA */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-mono text-sm tracking-[0.25em] text-[#FFAA00] font-bold">
                    METADATA
                  </h3>
                  <span className="font-mono text-[0.6rem] text-white/30">
                    [SEC_CLEARANCE_01]
                  </span>
                </div>

                {/* Metadata Items List */}
                <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                  {/* YEAR */}
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-white/40 tracking-[0.16em] uppercase">YEAR</span>
                    <span className="text-white font-medium">{project.metadata.year}</span>
                  </div>

                  {/* CONTEXT / CLIENT */}
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-white/40 tracking-[0.16em] uppercase">CONTEXT</span>
                    <span className="text-white font-medium text-right truncate max-w-[170px]">
                      {project.metadata.client || "Independent / Production"}
                    </span>
                  </div>

                  {/* TIME / DURATION */}
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-white/40 tracking-[0.16em] uppercase">TIME</span>
                    <span className="text-white font-medium">
                      {project.caseStudy?.duration || "N/A"}
                    </span>
                  </div>

                  {/* STATUS */}
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-white/40 tracking-[0.16em] uppercase">STATUS</span>
                    <span
                      className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider font-semibold"
                      style={{ color: statusColor }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
                      />
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* TAGS SECTION */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <span className="block font-mono text-[0.62rem] tracking-[0.2em] text-white/40 uppercase mb-2.5">
                    TAGS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="font-mono text-[0.6rem] px-2.5 py-1 tracking-wider uppercase border border-white/15 bg-white/[0.03] text-white/80">
                      {categoryLabel}
                    </span>
                    <span className="font-mono text-[0.6rem] px-2.5 py-1 tracking-wider uppercase border border-[#FFAA00]/40 bg-[#FFAA00]/10 text-[#FFAA00]">
                      {project.status}
                    </span>
                    {project.metadata.featured && (
                      <span className="font-mono text-[0.6rem] px-2.5 py-1 tracking-wider uppercase border border-white/15 bg-white/[0.03] text-white/80">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* STACKS SECTION */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <span className="block font-mono text-[0.62rem] tracking-[0.2em] text-white/40 uppercase mb-2.5">
                    STACKS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech.name}
                        onMouseEnter={() => playSound("hover")}
                        className="font-mono text-[0.62rem] px-2.5 py-1 tracking-wider uppercase border transition-all duration-200 cursor-default"
                        style={{
                          borderColor: tech.highlight ? "rgba(255,170,0,0.6)" : "rgba(255,255,255,0.12)",
                          background: tech.highlight ? "rgba(255,170,0,0.08)" : "rgba(255,255,255,0.02)",
                          color: tech.highlight ? "#FFAA00" : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACCESS SITE / CODE BUTTONS */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2.5">
                  {project.links.liveDemo ? (
                    <a
                      href={project.links.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => playSound("open")}
                      className="w-full text-center py-2.5 font-mono text-xs tracking-[0.2em] uppercase font-bold bg-[#FFAA00] hover:bg-[#ffbe33] text-[#050505] transition-all duration-200 shadow-lg"
                    >
                      ACCESS SITE
                    </a>
                  ) : project.links.previewUrl ? (
                    <a
                      href={project.links.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => playSound("open")}
                      className="w-full text-center py-2.5 font-mono text-xs tracking-[0.2em] uppercase font-bold bg-[#FFAA00] hover:bg-[#ffbe33] text-[#050505] transition-all duration-200 shadow-lg"
                    >
                      ACCESS SITE
                    </a>
                  ) : null}

                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => playSound("open")}
                      className="w-full text-center py-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase border border-white/15 hover:border-[#FFAA00] text-white/70 hover:text-[#FFAA00] bg-white/[0.02] hover:bg-[#FFAA00]/5 transition-all duration-200"
                    >
                      VIEW SOURCE REPO
                    </a>
                  )}
                </div>
              </div>
            </aside>

            {/* ══════════════════════════════════════════════════════════════
                8-COLUMN RIGHT CONTENT AREA
            ══════════════════════════════════════════════════════════════ */}
            <main className="lg:col-span-8 flex flex-col gap-8">
              {/* Project Title Header */}
              <div>
                <span className="font-mono text-[0.65rem] tracking-[0.25em] text-[#FFAA00] uppercase block mb-1">
                  &gt;&gt; EVIDENCE // {project.metadata.evidenceId}
                </span>
                <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                  {project.title}
                </h2>
              </div>

              {/* MISSION REQUIREMENTS / OVERVIEW */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-[#FFAA00]">
                  <span>&gt;&gt; MISSION_REQUIREMENTS</span>
                </div>
                <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed">
                  "{project.fullDescription}"
                </p>
              </div>

              {/* ── IMAGE / HERO MEDIA CONTAINER WITH MINIMALIST & PREMIUM BORDER HOVER ANIMATION ── */}
              <div className="project-media-frame group overflow-hidden bg-[#0a0a0a] rounded-xs">
                {/* 4 Precision Corner Reticles */}
                <span className="corner-reticle absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFAA00]/70 z-20 pointer-events-none" />
                <span className="corner-reticle absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFAA00]/70 z-20 pointer-events-none" />
                <span className="corner-reticle absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFAA00]/70 z-20 pointer-events-none" />
                <span className="corner-reticle absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFAA00]/70 z-20 pointer-events-none" />

                {/* Top Corner HUD Badge */}
                <div className="absolute top-3 right-4 z-20 font-mono text-[0.55rem] tracking-widest text-[#FFAA00] bg-black/80 px-2 py-0.5 border border-[#FFAA00]/30 opacity-80 group-hover:opacity-100 transition-opacity">
                  [ EXAMINE_VIEW ]
                </div>

                {/* Media Component */}
                <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[360px] transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                  <ProjectMediaFallback
                    title={project.shortTitle ?? project.title}
                    evidenceId={project.metadata.evidenceId}
                    category={categoryLabel.toUpperCase()}
                    variant={project.thumbnail.fallbackVariant ?? "schematic"}
                    className="w-full h-full !min-h-0 !border-0"
                  />
                </div>
              </div>

              {/* TECHNICAL ANALYSIS & PROBLEM / SOLUTION */}
              {project.caseStudy && (
                <div className="flex flex-col gap-6">
                  {/* Technical Analysis */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-[#FFAA00]">
                      <span>&gt;&gt; TECHNICAL_ANALYSIS</span>
                    </div>
                    <p className="font-sans text-sm sm:text-base text-white/75 leading-relaxed">
                      {project.caseStudy.solution}
                    </p>
                  </div>

                  {/* Architecture Highlights */}
                  {project.caseStudy.architectureHighlights.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/40 uppercase">
                        SYSTEM ARCHITECTURE SPECIFICATIONS:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {project.caseStudy.architectureHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
                          >
                            <span className="font-mono text-[0.65rem] text-[#FFAA00] font-bold">
                              [{String(idx + 1).padStart(2, "0")}]
                            </span>
                            <span className="font-sans text-xs text-white/70 leading-normal">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features 2x2 Grid */}
                  {project.caseStudy.keyFeatures.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/40 uppercase">
                        CORE CAPABILITIES &amp; MODULES:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {project.caseStudy.keyFeatures.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 p-3 border border-white/10 bg-[#0c0c0c]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] shrink-0" />
                            <span className="font-sans text-xs text-white/80 font-medium">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results Callout */}
                  <div className="p-4 sm:p-5 border border-[#FFAA00]/30 bg-[#FFAA00]/[0.04] flex flex-col gap-1.5">
                    <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#FFAA00] uppercase font-bold">
                      &gt;&gt; VERIFIED_METRICS // RESULTS:
                    </span>
                    <p className="font-sans text-xs sm:text-sm text-white/85 leading-relaxed">
                      {project.caseStudy.results}
                    </p>
                  </div>
                </div>
              )}

              {/* ── BOTTOM BOOK NAVIGATION BAR (PREV / NEXT WITH ZOOM EFFECT) ── */}
              <div className="pt-6 border-t border-white/10 flex items-stretch gap-3">
                {previous ? (
                  <button
                    onClick={() => {
                      playSound("click");
                      onNavigate(previous.slug, -1);
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex-1 p-3 sm:p-4 border border-white/10 hover:border-[#FFAA00]/50 bg-white/[0.02] hover:bg-[#FFAA00]/5 text-left transition-all duration-200 group"
                  >
                    <span className="font-mono text-[0.58rem] tracking-[0.2em] text-[#FFAA00] flex items-center gap-1.5 uppercase">
                      ← PREV_PROJECT
                    </span>
                    <span className="block font-sans font-semibold text-xs sm:text-sm text-white/80 group-hover:text-white mt-1 truncate">
                      {previous.shortTitle ?? previous.title}
                    </span>
                  </button>
                ) : (
                  <div className="flex-1" />
                )}

                {next ? (
                  <button
                    onClick={() => {
                      playSound("click");
                      onNavigate(next.slug, 1);
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex-1 p-3 sm:p-4 border border-white/10 hover:border-[#FFAA00]/50 bg-white/[0.02] hover:bg-[#FFAA00]/5 text-right transition-all duration-200 group"
                  >
                    <span className="font-mono text-[0.58rem] tracking-[0.2em] text-[#FFAA00] flex items-center justify-end gap-1.5 uppercase">
                      NEXT_PROJECT →
                    </span>
                    <span className="block font-sans font-semibold text-xs sm:text-sm text-white/80 group-hover:text-white mt-1 truncate">
                      {next.shortTitle ?? next.title}
                    </span>
                  </button>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
