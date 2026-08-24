import { Hero } from "@/frontend/components/hero";
import { ProfileSection } from "@/frontend/components/profile";
import { ProjectsSection } from "@/frontend/components/projects";
import { ContactSection } from "@/frontend/components/contact";

/**
 * Public portfolio — home page
 *
 * 01 Hero (#hero) — Foundation identity screen
 * 02 Profile (#profile) — Digital dossier section
 * 03 Projects (#projects) — Interactive project gallery & SPA modal
 * 04 Contact (#contact) — Minimalist contact interface, 2D radar map & social links
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── 01: HERO SECTION FOUNDATION ── */}
      <Hero />

      {/* ── 02: PROFILE SECTION ── */}
      <ProfileSection />

      {/* ── 03: PROJECTS SECTION ── */}
      <ProjectsSection />

      {/* ── 04: CONTACT SECTION ── */}
      <ContactSection />
    </div>
  );
}
