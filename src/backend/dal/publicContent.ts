import connectMongoose from "@/backend/db/mongoose";
import { PortfolioContent, Project as ProjectModel } from "@/backend/models/PortfolioContent";
import { defaultHeroContent, HeroContent } from "@/frontend/lib/heroContent";
import { defaultProfileContent, ProfileContent } from "@/frontend/lib/profileContent";
import { PROJECTS_DATA } from "@/frontend/lib/projects/data";
import { Project } from "@/frontend/types/project";

export type Locale = "fr" | "en";

function loc(field: any, locale: Locale, fallback = ""): string {
  if (!field) return fallback;
  if (typeof field === "string") return field;
  return field[locale] || field.en || field.fr || fallback;
}

export async function getDynamicPortfolioData(locale: Locale = "en") {
  try {
    await connectMongoose();

    const [contentDoc, dbProjects] = await Promise.all([
      PortfolioContent.findOne({}).lean(),
      ProjectModel.find({ published: { $ne: false } }).sort({ "metadata.order": 1 }).lean(),
    ]);

    // Map Hero
    let hero: HeroContent = defaultHeroContent;
    if (contentDoc?.hero) {
      const h = contentDoc.hero as any;
      hero = {
        availability: loc(h.availability, locale, defaultHeroContent.availability),
        name: {
          first: h.nameFirst || defaultHeroContent.name.first,
          last: h.nameLast || defaultHeroContent.name.last,
        },
        role: loc(h.role, locale, defaultHeroContent.role),
        bio: loc(h.bio, locale, defaultHeroContent.bio),
        scrollLabel: loc(h.scrollLabel, locale, defaultHeroContent.scrollLabel),
      };
    }

    // Map Profile
    let profile: ProfileContent = defaultProfileContent;
    if (contentDoc?.profile) {
      const p = contentDoc.profile as any;
      profile = {
        header: {
          index: p.header?.index || "01",
          label: loc(p.header?.label, locale, defaultProfileContent.header.label),
          stamp: loc(p.header?.stamp, locale, defaultProfileContent.header.stamp),
          systemRef: p.header?.systemRef || "ZB-DOC-2026.1",
        },
        identity: {
          fullName: p.identity?.fullName || defaultProfileContent.identity.fullName,
          roleTitle: loc(p.identity?.roleTitle, locale, defaultProfileContent.identity.roleTitle),
          classCode: p.identity?.classCode || "DEV_FULLSTACK",
          location: p.identity?.location || defaultProfileContent.identity.location,
          workMode: loc(p.identity?.workMode, locale, defaultProfileContent.identity.workMode),
          availability: loc(p.identity?.availability, locale, defaultProfileContent.identity.availability),
          profileImage: p.identity?.profileImage || defaultProfileContent.identity.profileImage,
          languages: p.identity?.languages?.length ? p.identity.languages : defaultProfileContent.identity.languages,
        },
        summary: loc(p.summary, locale, defaultProfileContent.summary),
        education: (p.education?.length ? p.education : defaultProfileContent.education).map((edu: any) => ({
          institution: edu.institution,
          period: edu.period,
          degree: loc(edu.degree, locale, typeof edu.degree === "string" ? edu.degree : ""),
          field: loc(edu.field, locale, typeof edu.field === "string" ? edu.field : ""),
        })),
        experience: (p.experience?.length ? p.experience : defaultProfileContent.experience).map((exp: any) => ({
          company: exp.company,
          role: loc(exp.role, locale, typeof exp.role === "string" ? exp.role : ""),
          period: exp.period,
          stack: exp.stack || [],
          description: loc(exp.description, locale, typeof exp.description === "string" ? exp.description : ""),
        })),
        hardSkills: (p.hardSkills?.length ? p.hardSkills : defaultProfileContent.hardSkills).map((s: any) => String(s)),
        softSkills: (p.softSkills?.length ? p.softSkills : defaultProfileContent.softSkills).map((s: any) => String(s)),
        resume: {
          label: loc(p.resume?.label, locale, defaultProfileContent.resume.label),
          href: p.resume?.href || defaultProfileContent.resume.href,
          downloadFilename: p.resume?.downloadFilename || defaultProfileContent.resume.downloadFilename,
        },
      };
    }

    // Map Projects
    let projects: Project[] = PROJECTS_DATA;
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
        technologies: (dp.technologies || []).map((t: any) => ({
          name: typeof t === "string" ? t : (t.name || ""),
          category: (typeof t === "object" && t?.category) || "other",
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
            }
          : undefined,
        metadata: {
          evidenceId: dp.metadata?.evidenceId || "EVIDENCE",
          year: dp.metadata?.year || "2026",
          client: dp.metadata?.client || "",
          featured: dp.metadata?.featured ?? false,
          order: dp.metadata?.order ?? 999,
        },
      }));
    }

    let contact = null;
    if (contentDoc?.contact) {
      const c = contentDoc.contact as any;
      contact = {
        email: c.email || "zackwebdev56@gmail.com",
        headline: loc(c.headline, locale, ""),
        availabilityBadge: loc(c.availabilityBadge, locale, ""),
        locationCity: c.locationCity || "Beni Mellal",
        locationCountry: c.locationCountry || "Morocco",
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
    console.error("Failed to fetch dynamic portfolio content, falling back to static data:", error);
    return {
      hero: defaultHeroContent,
      profile: defaultProfileContent,
      projects: PROJECTS_DATA,
      contact: null,
    };
  }
}
