import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap — will include project slugs fetched from MongoDB.
 * Currently returns static routes only.
 * Expanded in Task 6.7 (project detail route) and Phase 13 (SEO).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Project routes will be appended here once the DB layer is wired up.
    // e.g. { url: `${baseUrl}/projects/${slug}`, ... }
  ];
}
