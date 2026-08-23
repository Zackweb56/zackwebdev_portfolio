/**
 * ─── Projects Component Foundation — Public API ──────────────────────────────
 */

export { ProjectsSection } from "./ProjectsSection";
export { ProjectGalleryCard } from "./ProjectGalleryCard";
export { ProjectMediaFallback } from "./ProjectMediaFallback";
export { ProjectMedia } from "./ProjectMedia";
export { ProjectStatusBadge } from "./ProjectStatusBadge";
export { ProjectTechList } from "./ProjectTechList";
export { ProjectLinkButtons } from "./ProjectLinkButtons";
export { ProjectCardPrimitive } from "./ProjectCardPrimitive";
export { ProjectDetailModal } from "./ProjectDetailModal";
export type { CardVisualState } from "./ProjectCardPrimitive";

// Re-export types and registry helpers for convenience
export * from "@/frontend/types/project";
export * from "@/frontend/lib/projects/registry";

