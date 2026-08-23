import React from "react";
import { ProjectStatus } from "@/frontend/types/project";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

/**
 * ProjectStatusBadge
 *
 * Compact monospace project lifecycle indicator tag.
 */
export function ProjectStatusBadge({
  status,
  className = "",
}: ProjectStatusBadgeProps) {
  const configMap: Record<
    ProjectStatus,
    { label: string; dotClass: string; textClass: string; borderClass: string }
  > = {
    completed: {
      label: "COMPLETED",
      dotClass: "bg-[#FFAA00]",
      textClass: "text-[#FFAA00]",
      borderClass: "border-[#FFAA00]/30 bg-[#FFAA00]/5",
    },
    "in-progress": {
      label: "IN_PROGRESS",
      dotClass: "bg-[#FFAA00] animate-ping",
      textClass: "text-[#FFAA00]",
      borderClass: "border-[#FFAA00]/40 bg-[#FFAA00]/10",
    },
    archived: {
      label: "ARCHIVED",
      dotClass: "bg-white/40",
      textClass: "text-white/50",
      borderClass: "border-white/10 bg-white/[0.02]",
    },
    concept: {
      label: "CONCEPT",
      dotClass: "bg-white/30",
      textClass: "text-white/40",
      borderClass: "border-white/10 bg-transparent",
    },
  };

  const config = configMap[status] || configMap.completed;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[0.6rem] tracking-widest uppercase select-none rounded-xs ${config.borderClass} ${config.textClass} ${className}`}
      aria-label={`Project Status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
}
