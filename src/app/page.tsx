import {
  TechnicalFrame,
  TechnicalStatus,
  TechnicalLabel,
  TechnicalMetadata,
  TechnicalDivider,
  TechnicalSectionLabel,
} from "@/frontend/components/technical";

/**
 * Public portfolio — home page
 *
 * Section shells for anchor navigation, IntersectionObserver active-section tracking,
 * and Technical UI primitive showcase.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── 01: HERO SECTION SHELL ── */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center p-8 gap-10"
      >
        {/* Technical UI Primitive Demo — to be replaced by real Hero content in Task Hero */}
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <TechnicalLabel variant="amber" prefix="//">
              SYSTEM_INITIALIZED
            </TechnicalLabel>
            <TechnicalStatus label="ONLINE" pulse />
          </div>

          <TechnicalDivider index="00" label="PORTFOLIO_SYS" />

          <TechnicalFrame
            code="SYS"
            title="TECHNICAL UI FOUNDATION"
            headerRight={
              <TechnicalLabel variant="muted" prefix="[" suffix="]">
                READ_ONLY
              </TechnicalLabel>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2">
              <TechnicalMetadata label="SUBJECT" value="ZB-FULLSTACK" />
              <TechnicalMetadata label="STATUS" value="AVAILABLE" />
              <TechnicalMetadata label="ROLE" value="FULL STACK DEV" />
              <TechnicalMetadata label="SYSTEM" value="NEXT.JS + TS" orientation="vertical" />
              <TechnicalMetadata label="VERSION" value="2026.1" orientation="vertical" />
              <TechnicalMetadata label="CLEARANCE" value="ACTIVE" orientation="vertical" />
            </div>
          </TechnicalFrame>

          <TechnicalDivider label="SECTIONS_INDEX" />

          <div className="flex flex-col gap-3">
            <button
              type="button"
              data-cursor="inspect"
              className="text-left"
            >
              <TechnicalSectionLabel index="01" label="Profile" stamp="SUBJECT // DOSSIER" />
            </button>
            <button
              type="button"
              data-cursor="inspect"
              className="text-left"
            >
              <TechnicalSectionLabel index="02" label="Projects" stamp="EVIDENCE // ARCHIVE" />
            </button>
            <button
              type="button"
              data-cursor="inspect"
              className="text-left"
            >
              <TechnicalSectionLabel index="03" label="Contact" stamp="SECURE // CHANNEL" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 02: PROFILE SECTION SHELL ── */}
      <section
        id="profile"
        className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 border-t border-white/5"
      >
        <TechnicalSectionLabel index="02" label="Profile" stamp="SUBJECT // DOSSIER" />
        <p className="font-mono text-xs text-white/30 tracking-widest mt-2">
          [AWAITING TASK — PROFILE UI]
        </p>
      </section>

      {/* ── 03: PROJECTS SECTION SHELL ── */}
      <section
        id="projects"
        className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 border-t border-white/5"
      >
        <TechnicalSectionLabel index="03" label="Projects" stamp="EVIDENCE // ARCHIVE" />
        <p className="font-mono text-xs text-white/30 tracking-widest mt-2">
          [AWAITING TASK — PROJECTS UI]
        </p>
      </section>

      {/* ── 04: CONTACT SECTION SHELL ── */}
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 border-t border-white/5"
      >
        <TechnicalSectionLabel index="04" label="Contact" stamp="SECURE // CHANNEL" />
        <p className="font-mono text-xs text-white/30 tracking-widest mt-2">
          [AWAITING TASK — CONTACT UI]
        </p>
      </section>
    </div>
  );
}
