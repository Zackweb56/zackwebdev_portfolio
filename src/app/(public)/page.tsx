import { cookies } from "next/headers";
import { Hero } from "@/frontend/components/hero";
import { ProfileSection } from "@/frontend/components/profile";
import { ProjectsSection } from "@/frontend/components/projects";
import { ContactSection } from "@/frontend/components/contact";
import { getDynamicPortfolioData } from "@/backend/dal/publicContent";
import { getActiveLanguages } from "@/backend/dal/languages";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: Promise<{ lang?: string }>;
}

/**
 * Public portfolio — home page
 *
 * 01 Hero (#hero) — Foundation identity screen
 * 02 Profile (#profile) — Digital dossier section
 * 03 Projects (#projects) — Interactive project gallery & SPA modal
 * 04 Contact (#contact) — Minimalist contact interface, 2D radar map & social links
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("portfolio_lang")?.value;

  // Query active languages to validate incoming locale selection
  const activeLanguages = await getActiveLanguages();
  const activeCodes = activeLanguages.map((l) => l.code.toLowerCase());
  const defaultLang = activeLanguages.find((l) => l.isDefault)?.code || "en";

  const requestedLang = (resolvedParams.lang || cookieLang || defaultLang).toLowerCase();
  const selectedLang = activeCodes.includes(requestedLang) ? requestedLang : defaultLang;

  // Retrieve dynamic localized content
  const data = await getDynamicPortfolioData(selectedLang);

  return (
    <div className="flex flex-col w-full">
      {/* ── 01: HERO SECTION FOUNDATION ── */}
      <Hero content={data.hero} />

      {/* ── 02: PROFILE SECTION ── */}
      <ProfileSection content={data.profile} />

      {/* ── 03: PROJECTS SECTION ── */}
      <ProjectsSection projects={data.projects} />

      {/* ── 04: CONTACT SECTION ── */}
      <ContactSection content={data.contact} />
    </div>
  );
}
