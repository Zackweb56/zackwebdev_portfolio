"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Project } from "@/frontend/types/project";
import { getAllProjects, getProjectBySlug } from "@/frontend/lib/projects/registry";
import { ProjectGalleryCard } from "./ProjectGalleryCard";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { playSound } from "@/frontend/lib/sound";


type ViewMode = "slider" | "grid";

/**
 * ProjectsSection (Task 15)
 *
 * Header row:
 *   LEFT  — TechnicalSectionLabel + record count
 *   CENTER — [ SLIDER ] [ GRID ] view toggle buttons
 *   RIGHT  — < > arrow pair (slider mode only), centered and close together
 *
 * Slider mode: full-bleed horizontal drag-to-scroll ribbon of portrait cards
 * Grid mode:   3-column (→ 2 → 1) responsive grid of landscape cards
 *
 * Cards: collapsed by default, hover to expand full details.
 * Click opens interactive fullscreen terminal/modal with zoom & book navigation.
 */
export function ProjectsSection({
  projects: initialProjects,
  className = "",
}: {
  projects?: Project[];
  className?: string;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("slider");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalDirection, setModalDirection] = useState<number>(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [progress, setProgress] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const projects = initialProjects && initialProjects.length > 0 ? initialProjects : getAllProjects();

  const handleOpenModal = useCallback((project: Project) => {
    setModalDirection(1);
    setSelectedProject(project);
  }, []);

  const handleModalNavigate = useCallback((slug: string, direction: number) => {
    const nextProject = getProjectBySlug(slug);
    if (nextProject) {
      setModalDirection(direction);
      setSelectedProject(nextProject);
    }
  }, []);


  // ─── Scroll sync ────────────────────────────────────────────────────────────
  const syncScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollPrev(scrollLeft > 8);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 8);
    const max = scrollWidth - clientWidth;
    setProgress(max > 0 ? scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    if (viewMode !== "slider") return;
    const track = trackRef.current;
    if (!track) return;
    syncScrollState();
    track.addEventListener("scroll", syncScrollState, { passive: true });
    return () => track.removeEventListener("scroll", syncScrollState);
  }, [viewMode, syncScrollState]);

  // ─── Arrow scroll ────────────────────────────────────────────────────────────
  const scrollAmount = useCallback(() => {
    const track = trackRef.current;
    const first = track?.querySelector("[data-gallery-card]") as HTMLElement | null;
    return first ? first.offsetWidth + 16 : 300;
  }, []);

  const scrollPrev = useCallback(() => {
    if (!trackRef.current) return;
    playSound("click");
    trackRef.current.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  }, [scrollAmount]);

  const scrollNext = useCallback(() => {
    if (!trackRef.current) return;
    playSound("click");
    trackRef.current.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  }, [scrollAmount]);

  // ─── Drag to scroll ──────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = track.scrollLeft;
    track.style.cursor = "grabbing";
    track.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
      trackRef.current.style.userSelect = "";
    }
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartScroll.current = trackRef.current?.scrollLeft ?? 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    trackRef.current.scrollLeft = dragStartScroll.current - (e.touches[0].clientX - dragStartX.current);
  }, []);

  // ─── View toggle ─────────────────────────────────────────────────────────────
  const handleViewSwitch = useCallback((mode: ViewMode) => {
    playSound("click");
    setViewMode(mode);
    // Reset scroll
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, []);

  // ─── Shared arrow button renderer ────────────────────────────────────────────
  function ArrowBtn({
    dir,
    disabled,
    onClick,
  }: {
    dir: "prev" | "next";
    disabled: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={dir === "prev" ? "Previous projects" : "Next projects"}
        onMouseEnter={() => !disabled && playSound("hover")}
        style={{
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: disabled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,170,0,0.5)",
          background: disabled ? "rgba(5,5,5,0.5)" : "rgba(255,170,0,0.07)",
          opacity: disabled ? 0.3 : 1,
          cursor: disabled ? "default" : "pointer",
          transition: "border-color 0.2s, opacity 0.2s, background 0.2s",
          backdropFilter: "blur(6px)",
          flexShrink: 0,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{ color: disabled ? "rgba(255,255,255,0.25)" : "#FFAA00" }}
        >
          {dir === "prev" ? (
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>
    );
  }

  return (
    <section
      id="projects"
      className={`relative w-full flex flex-col py-20 lg:py-28 overflow-hidden border-t ${className}`}
      style={{ borderColor: "rgba(255,255,255,0.05)", background: "#050505" }}
      aria-label="Projects — Evidence Archive"
    >
      {/* ════════════════════════════════════════════════════════
          SECTION HEADER
          LEFT: label + count  |  CENTER: view toggles  |  RIGHT: arrows
      ════════════════════════════════════════════════════════ */}
      <div className="px-4 sm:px-6 lg:px-14 mb-8 flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center">
        {/* LEFT — Section label */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[#FFAA00] uppercase opacity-75 select-none">
              EVIDENCE // ARCHIVE
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#FFAA00] tracking-widest font-semibold">[02]</span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white/90 uppercase tracking-tight">Projects</h2>
            </div>
          </div>
          <span
            className="font-mono text-[0.6rem] tracking-[0.18em] uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {String(projects.length).padStart(2, "0")} RECORDS FOUND
          </span>
        </div>

        {/* CENTER — View mode toggles */}
        <div className="flex items-center justify-start sm:justify-center gap-2">
          {/* SLIDER toggle */}
          <button
            onClick={() => handleViewSwitch("slider")}
            onMouseEnter={() => playSound("hover")}
            aria-label="Slider view"
            aria-pressed={viewMode === "slider"}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200"
            style={{
              border: viewMode === "slider"
                ? "1px solid rgba(255,170,0,0.6)"
                : "1px solid rgba(255,255,255,0.1)",
              background: viewMode === "slider"
                ? "rgba(255,170,0,0.1)"
                : "transparent",
              color: viewMode === "slider" ? "#FFAA00" : "rgba(255,255,255,0.35)",
            }}
          >
            {/* Slider icon — 3 vertical bars */}
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.8" />
              <rect x="4.5" y="0" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.5" />
              <rect x="9" y="0" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.3" />
            </svg>
            SLIDER
          </button>

          {/* GRID toggle */}
          <button
            onClick={() => handleViewSwitch("grid")}
            onMouseEnter={() => playSound("hover")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200"
            style={{
              border: viewMode === "grid"
                ? "1px solid rgba(255,170,0,0.6)"
                : "1px solid rgba(255,255,255,0.1)",
              background: viewMode === "grid"
                ? "rgba(255,170,0,0.1)"
                : "transparent",
              color: viewMode === "grid" ? "#FFAA00" : "rgba(255,255,255,0.35)",
            }}
          >
            {/* Grid icon — 2×2 squares */}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="4" height="4" rx="0.5" fill="currentColor" />
              <rect x="6" y="0" width="4" height="4" rx="0.5" fill="currentColor" />
              <rect x="0" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
              <rect x="6" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
            </svg>
            GRID
          </button>
        </div>

        {/* RIGHT — Arrows (slider only) */}
        <div className="flex items-center justify-start sm:justify-end gap-1">
          {viewMode === "slider" && (
            <>
              <ArrowBtn dir="prev" disabled={!canScrollPrev} onClick={scrollPrev} />
              <ArrowBtn dir="next" disabled={!canScrollNext} onClick={scrollNext} />
            </>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SLIDER VIEW — full-bleed horizontal ribbon
      ════════════════════════════════════════════════════════ */}
      {viewMode === "slider" && (
        <div className="relative w-full">
          {/* Scrollable track — no max-width, bleeds to viewport */}
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-14 pb-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
              cursor: "grab",
              scrollSnapType: "x mandatory",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            role="list"
            aria-label="Project cards carousel"
          >
            <style>{`
              [aria-label="Project cards carousel"]::-webkit-scrollbar { display: none; }
            `}</style>

            {projects.map((project, i) => (
              <div
                key={project.id}
                data-gallery-card
                role="listitem"
                style={{ scrollSnapAlign: "start", flexShrink: 0 }}
              >
                <ProjectGalleryCard
                  project={project}
                  index={i}
                  variant="slider"
                  onSelect={handleOpenModal}
                />
              </div>
            ))}

            {/* Trailing spacer */}
            <div className="flex-shrink-0 w-4 sm:w-8 lg:w-14" aria-hidden="true" />
          </div>

          {/* Progress bar */}
          <div
            className="mt-5 mx-4 sm:mx-6 lg:mx-14 h-px relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                width: `${progress * 100}%`,
                background: "#FFAA00",
                boxShadow: "0 0 6px rgba(255,170,0,0.5)",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          <div
            className="mt-2 mx-4 sm:mx-6 lg:mx-14 flex items-center justify-between font-mono text-[0.57rem] tracking-[0.18em] uppercase"
          >
            <span style={{ color: "rgba(255,255,255,0.18)" }}>
              LIVE_FEED · {String(projects.length).padStart(2, "0")} RECORDS
            </span>
            <span style={{ color: "rgba(255,170,0,0.4)" }}>
              DRAG TO EXPLORE ←→
            </span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          GRID VIEW — 3 → 2 → 1 responsive columns
      ════════════════════════════════════════════════════════ */}
      {viewMode === "grid" && (
        <div className="px-4 sm:px-6 lg:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {projects.map((project, i) => (
              <ProjectGalleryCard
                key={project.id}
                project={project}
                index={i}
                variant="grid"
                onSelect={handleOpenModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          FULLSCREEN PROJECT DETAIL MODAL / TERMINAL VIEW
      ════════════════════════════════════════════════════════ */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigate={handleModalNavigate}
        direction={modalDirection}
      />
    </section>
  );
}
