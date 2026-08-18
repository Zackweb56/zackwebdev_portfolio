import { Hero } from "@/frontend/components/hero";
import { ProfileSection } from "@/frontend/components/profile";
import { TechnicalSectionLabel } from "@/frontend/components/technical";

/**
 * Public portfolio — home page
 *
 * Section assembly for public presentation.
 * 01 Hero (#hero) — Foundation identity screen wrapped in FlashlightContent
 * 02 Profile (#profile) — Digital dossier section wrapped in FlashlightContent
 * 03 Projects (#projects) — Awaiting Task 14-16
 * 04 Contact (#contact) — Awaiting Task 17
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── 01: HERO SECTION FOUNDATION ── */}
      <Hero />

      {/* ── 02: PROFILE SECTION (Task 13 Completed) ── */}
      <ProfileSection />

      {/* ── 03: PROJECTS SECTION SHELL (Awaiting Task 14-16) ── */}
      <section
        id="projects"
        className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 border-t border-white/5"
      >
        <TechnicalSectionLabel index="03" label="Projects" stamp="EVIDENCE // ARCHIVE" />
        <p className="font-mono text-xs text-white/30 tracking-widest mt-2">
          [AWAITING TASK 14-16 — PROJECTS UI]
        </p>
      </section>

      {/* ── 04: CONTACT SECTION SHELL (Awaiting Task 17) ── */}
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 border-t border-white/5"
      >
        <TechnicalSectionLabel index="04" label="Contact" stamp="SECURE // CHANNEL" />
        <p className="font-mono text-xs text-white/30 tracking-widest mt-2">
          [AWAITING TASK 17 — CONTACT UI]
        </p>
      </section>
    </div>
  );
}
