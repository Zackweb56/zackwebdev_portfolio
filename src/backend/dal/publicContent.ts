import connectMongoose from "@/backend/db/mongoose";
import { PortfolioContent, Project as ProjectModel } from "@/backend/models/PortfolioContent";
import { HeroContent } from "@/frontend/lib/heroContent";
import { ProfileContent } from "@/frontend/lib/profileContent";
import { Project } from "@/frontend/types/project";

export type Locale = string;

/** Extracts a localized string from a localized field map */
function loc(field: any, locale: string, fallback = ""): string {
  if (!field) return fallback;
  if (typeof field === "string") return field;
  return (
    field[locale] ||
    field.en ||
    field.fr ||
    (typeof field === "object" ? Object.values(field).find((v) => typeof v === "string" && v) : "") ||
    fallback
  );
}

/**
 * Returns fully dynamic portfolio content from MongoDB.
 * When no DB document exists, hero/profile are `null` so the frontend
 * renders styled empty-state alerts instead of static placeholder content.
 * Projects is `[]` when no published projects are found.
 */
export async function getDynamicPortfolioData(locale: string = "en") {
  try {
    await connectMongoose();

    const [contentDoc, dbProjects] = await Promise.all([
      PortfolioContent.findOne({}).lean(),
      ProjectModel.find({ published: { $ne: false } }).sort({ "metadata.order": 1 }).lean(),
    ]);

    // ── Hero ─────────────────────────────────────────────────────────────────
    let hero: HeroContent | null = null;
    if (contentDoc?.hero) {
      const h = contentDoc.hero as any;
      // Only map if at least one field is present
      const hasContent =
        h.nameFirst || h.nameLast || h.availability || h.role || h.bio;
      if (hasContent) {
        hero = {
          availability: loc(h.availability, locale),
          name: {
            first: h.nameFirst || "",
            last: h.nameLast || "",
          },
          role: loc(h.role, locale),
          bio: loc(h.bio, locale),
          scrollLabel: loc(h.scrollLabel, locale, "Explore"),
        };
      }
    }

    // ── Profile ───────────────────────────────────────────────────────────────
    let profile: ProfileContent | null = null;
    if (contentDoc?.profile) {
      const p = contentDoc.profile as any;
      profile = {
        header: {
          index: p.header?.index || "01",
          label: loc(p.header?.label, locale, "PROFILE"),
          stamp: loc(p.header?.stamp, locale, "DOSSIER // SUBJECT SPECIFICATION"),
          systemRef: p.header?.systemRef || "ZB-DOC-2026.1",
        },
        identity: {
          fullName: p.identity?.fullName || "",
          roleTitle: loc(p.identity?.roleTitle, locale),
          classCode: p.identity?.classCode || "DEV_FULLSTACK",
          location: p.identity?.location || "",
          workMode: loc(p.identity?.workMode, locale),
          availability: loc(p.identity?.availability, locale),
          profileImage: p.identity?.profileImage || "",
          languages: p.identity?.languages?.length ? p.identity.languages : [],
        },
        summary: loc(p.summary, locale),
        education: (p.education || []).map((edu: any) => ({
          institution: edu.institution,
          period: edu.period,
          degree: loc(edu.degree, locale, typeof edu.degree === "string" ? edu.degree : ""),
          field: loc(edu.field, locale, typeof edu.field === "string" ? edu.field : ""),
        })),
        experience: (p.experience || []).map((exp: any) => ({
          company: exp.company,
          role: loc(exp.role, locale, typeof exp.role === "string" ? exp.role : ""),
          period: exp.period,
          stack: exp.stack || [],
          description: loc(exp.description, locale, typeof exp.description === "string" ? exp.description : ""),
        })),
        hardSkills: (p.hardSkills || []).map((s: any) => String(s)),
        softSkills: (p.softSkills || []).map((s: any) => String(s)),
        resume: {
          label: loc(p.resume?.label, locale, "VIEW & DOWNLOAD CV"),
          href:
            p.resume?.cvFiles && Object.keys(p.resume.cvFiles).length > 0
              ? p.resume.cvFiles[locale] || ""
              : p.resume?.href || "",
          downloadFilename: p.resume?.downloadFilename || "",
          cvFiles: p.resume?.cvFiles || undefined,
          // isAvailable is true only when a URL exists for the current locale
          isAvailable:
            p.resume?.cvFiles && Object.keys(p.resume.cvFiles).length > 0
              ? Boolean(p.resume.cvFiles[locale])
              : Boolean(p.resume?.href),
          locale,
        },
      };
    }

    // ── Projects ──────────────────────────────────────────────────────────────
    // Empty array when no published projects exist — never fall back to static data
    let projects: Project[] = [];
    if (dbProjects && dbProjects.length > 0) {
      projects = dbProjects.map((dp: any) => ({
        id: dp.projectId || dp._id?.toString() || "",
        slug: dp.slug,
        title: loc(dp.title, locale, dp.slug),
        shortTitle: loc(dp.shortTitle, locale, dp.slug),
        category: dp.category || "enterprise",
        status: dp.status || "completed",
        shortDescription: loc(dp.shortDescription, locale, ""),
        fullDescription: loc(dp.fullDescription, locale, ""),
        thumbnail: {
          src: dp.thumbnailSrc || undefined,
          alt: loc(dp.thumbnailAlt, locale, loc(dp.title, locale, "")),
          type: "image",
          fallbackVariant: "schematic",
          aspectRatio: "16/9",
        },
        gallery: Array.isArray(dp.gallery)
          ? dp.gallery.map((g: any) => ({
              src: g.src,
              alt: loc(g.alt, locale, ""),
              caption: loc(g.caption, locale, ""),
              type: "image",
              aspectRatio: "16/9",
            }))
          : undefined,
        tags: Array.isArray(dp.tags) ? dp.tags.map((t: any) => String(t)) : [],
        technologies: (dp.technologies || []).map((t: any) => ({
          name: typeof t === "string" ? t : (t.name || ""),
          category: (typeof t === "object" && t?.category) || "other",
          icon: typeof t === "object" && t?.icon ? String(t.icon) : undefined,
          highlight: Boolean(typeof t === "object" && t?.highlight),
        })),
        links: {
          github: dp.links?.github || "",
          live: dp.links?.live || "",
          demo: dp.links?.demo || "",
        },
        caseStudy: dp.caseStudy
          ? {
              overview: loc(dp.caseStudy.overview, locale, ""),
              problem: loc(dp.caseStudy.problem, locale, ""),
              solution: loc(dp.caseStudy.solution, locale, ""),
              role: loc(dp.caseStudy.role, locale, ""),
              duration: loc(dp.caseStudy.duration, locale, ""),
              architectureHighlights: Array.isArray(dp.caseStudy.architectureHighlights)
                ? dp.caseStudy.architectureHighlights.map((h: any) => String(h))
                : [],
              keyFeatures: Array.isArray(dp.caseStudy.keyFeatures)
                ? dp.caseStudy.keyFeatures.map((f: any) => String(f))
                : [],
              results: loc(dp.caseStudy.results, locale, ""),
              techStack: loc(dp.caseStudy.techStack, locale, ""),
              challenges: loc(dp.caseStudy.challenges, locale, ""),
              learnings: loc(dp.caseStudy.learnings, locale, ""),
            }
          : undefined,
        metadata: {
          evidenceId: dp.metadata?.evidenceId || "EVIDENCE",
          year: dp.metadata?.year || "2026",
          duration: dp.metadata?.duration || "",
          client: dp.metadata?.client || "",
          featured: dp.metadata?.featured ?? false,
          order: dp.metadata?.order ?? 999,
        },
      }));
    }

    // ── Contact ───────────────────────────────────────────────────────────────
    let contact = null;
    if (contentDoc?.contact) {
      const c = contentDoc.contact as any;
      contact = {
        email: c.email || "",
        headline: loc(c.headline, locale, ""),
        availabilityBadge: loc(c.availabilityBadge, locale, ""),
        locationCity: c.locationCity || "",
        locationCountry: c.locationCountry || "",
        mapCoords: {
          lat: c.mapCoords?.lat ?? 32.34,
          lng: c.mapCoords?.lng ?? -6.35,
        },
        socialLinks: (c.socialLinks || []).map((s: any) => ({
          id: s.id || "",
          name: s.name || "",
          code: s.code || "",
          href: s.href || "",
          platform: s.platform || "",
        })),
      };
    }

    // Ensure all values passed across Server to Client boundary are strictly plain JSON-serializable objects
    return JSON.parse(JSON.stringify({ hero, profile, projects, contact }));
  } catch (error) {
    console.error("[getDynamicPortfolioData] DB fetch failed, returning empty data:", error);
    // Return nulls/empty on DB error — sections will show styled empty-state alerts
    return {
      hero: null,
      profile: null,
      projects: [],
      contact: null,
    };
  }
}

