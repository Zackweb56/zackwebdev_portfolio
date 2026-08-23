/**
 * ─── Project Domain Models & Types ───────────────────────────────────────────
 *
 * Core TypeScript definitions for the Projects subsystem (Task 14).
 * Supports both Projects Gallery (Task 15) and Project Detail / Case Study (Task 16).
 */

export type ProjectStatus = "completed" | "in-progress" | "archived" | "concept";

export type ProjectCategory =
  | "fullstack"
  | "frontend"
  | "backend"
  | "enterprise"
  | "system";

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "tools"
  | "architecture"
  | "other";

export type MediaFallbackVariant =
  | "wireframe"
  | "schematic"
  | "terminal"
  | "grid";

export interface ProjectTechnology {
  name: string;
  category: TechCategory;
  highlight?: boolean;
}

export interface ProjectMedia {
  src?: string;
  alt?: string;
  type?: "image" | "video";
  fallbackVariant?: MediaFallbackVariant;
  caption?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
}

export interface ProjectLinks {
  liveDemo?: string;
  github?: string;
  caseStudy?: string;
  previewUrl?: string;
  externalDoc?: string;
}

export interface ProjectCaseStudy {
  overview: string;
  problem: string;
  solution: string;
  role: string;
  duration: string;
  architectureHighlights: string[];
  keyFeatures: string[];
  results: string;
}

export interface ProjectMetadata {
  evidenceId: string; // e.g. "EVIDENCE // 01"
  client?: string;
  year: string;
  featured: boolean;
  order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  shortDescription: string;
  fullDescription: string;
  thumbnail: ProjectMedia;
  gallery?: ProjectMedia[];
  technologies: ProjectTechnology[];
  links: ProjectLinks;
  caseStudy?: ProjectCaseStudy;
  metadata: ProjectMetadata;
}

export interface ProjectFilterOptions {
  category?: ProjectCategory;
  status?: ProjectStatus;
  featuredOnly?: boolean;
  tech?: string;
}

export interface ProjectStats {
  total: number;
  featuredCount: number;
  categories: Record<ProjectCategory, number>;
  technologiesCount: number;
}
