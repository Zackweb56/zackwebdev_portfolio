/**
 * ─── Projects Registry & Data Access Layer ───────────────────────────────────
 *
 * Centralized query API for accessing projects across the portfolio.
 * Decouples visual presentation components from the underlying data source,
 * making future CMS/MongoDB integration seamless (Phase 18–21).
 */

import { PROJECTS_DATA } from "./data";
import {
  Project,
  ProjectCategory,
  ProjectFilterOptions,
  ProjectStats,
} from "@/frontend/types/project";

/**
 * Retrieves all projects, sorted by metadata display order.
 */
export function getAllProjects(): Project[] {
  return [...PROJECTS_DATA].sort((a, b) => a.metadata.order - b.metadata.order);
}

/**
 * Retrieves only featured projects intended for the primary Projects Gallery.
 */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.metadata.featured);
}

/**
 * Finds a single project by its unique, URL-safe slug.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS_DATA.find((project) => project.slug === slug);
}

/**
 * Retrieves adjacent (previous and next) projects relative to a given slug.
 * Useful for horizontal carousel navigation and case study footers.
 */
export function getAdjacentProjects(
  slug: string
): { previous: Project | null; next: Project | null } {
  const all = getAllProjects();
  const currentIndex = all.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const previous = currentIndex > 0 ? all[currentIndex - 1] : null;
  const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : null;

  return { previous, next };
}

/**
 * Filters projects based on category, status, technology, or featured flags.
 */
export function filterProjects(options: ProjectFilterOptions = {}): Project[] {
  let list = getAllProjects();

  if (options.category) {
    list = list.filter((p) => p.category === options.category);
  }

  if (options.status) {
    list = list.filter((p) => p.status === options.status);
  }

  if (options.featuredOnly) {
    list = list.filter((p) => p.metadata.featured);
  }

  if (options.tech) {
    const term = options.tech.toLowerCase();
    list = list.filter((p) =>
      p.technologies.some((t) => t.name.toLowerCase().includes(term))
    );
  }

  return list;
}

/**
 * Retrieves high-level portfolio project statistics for metadata indicators.
 */
export function getProjectStats(): ProjectStats {
  const all = getAllProjects();
  const techSet = new Set<string>();

  const categories: Record<ProjectCategory, number> = {
    fullstack: 0,
    frontend: 0,
    backend: 0,
    enterprise: 0,
    system: 0,
  };

  all.forEach((p) => {
    categories[p.category] = (categories[p.category] || 0) + 1;
    p.technologies.forEach((t) => techSet.add(t.name));
  });

  return {
    total: all.length,
    featuredCount: all.filter((p) => p.metadata.featured).length,
    categories,
    technologiesCount: techSet.size,
  };
}

/**
 * Returns all unique project slugs for Next.js generateStaticParams().
 */
export function getAllProjectSlugs(): string[] {
  return PROJECTS_DATA.map((p) => p.slug);
}
