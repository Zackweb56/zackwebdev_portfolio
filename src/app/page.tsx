/**
 * Public portfolio — home page
 *
 * Section bounds (Hero, Profile, Projects, Contact) are mounted as semantic
 * <section id="..."> shells to enable anchor link navigation (#profile, #projects, #contact),
 * active section tracking via IntersectionObserver, and declarative custom cursor testing.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── 01: HERO SECTION SHELL ── */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center font-mono text-xs text-[#FFAA00] tracking-widest gap-3"
      >
        <p className="opacity-40">01 // HERO SHELL</p>
        <p className="text-white/80 text-sm">GLOBAL SYSTEM & CUSTOM CURSOR ACTIVE</p>
        <p className="opacity-40">[ID: #hero] [CURSOR_SYSTEM: READY]</p>

        {/* Declarative Cursor System Test Elements */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            type="button"
            data-cursor="inspect"
            className="px-4 py-2 border border-[#FFAA00]/40 text-[#FFAA00] bg-[#FFAA00]/5 text-xs rounded-sm hover:border-[#FFAA00]"
          >
            [ TEST: INSPECT ]
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-action="SOURCE"
            className="px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-xs rounded-sm"
          >
            [ TEST: SOURCE ]
          </a>
        </div>
      </section>

      {/* ── 02: PROFILE SECTION SHELL ── */}
      <section
        id="profile"
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center font-mono text-xs text-white/50 tracking-widest gap-2 border-t border-white/5"
      >
        <p className="text-[#FFAA00]" data-cursor="inspect">
          02 // PROFILE DOSSIER SHELL
        </p>
        <p className="opacity-40">[ID: #profile] [AWAITING TASK 8 — PROFILE UI]</p>
      </section>

      {/* ── 03: PROJECTS SECTION SHELL ── */}
      <section
        id="projects"
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center font-mono text-xs text-white/50 tracking-widest gap-2 border-t border-white/5"
      >
        <p className="text-[#FFAA00]" data-cursor-action="VIEW">
          03 // PROJECTS ARCHIVE SHELL
        </p>
        <p className="opacity-40">[ID: #projects] [AWAITING TASK 10 — PROJECTS UI]</p>
      </section>

      {/* ── 04: CONTACT SECTION SHELL ── */}
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center font-mono text-xs text-white/50 tracking-widest gap-2 border-t border-white/5"
      >
        <p className="text-[#FFAA00]" data-cursor-action="CONTACT">
          04 // CONTACT TERMINAL SHELL
        </p>
        <p className="opacity-40">[ID: #contact] [AWAITING TASK 13 — CONTACT UI]</p>
      </section>
    </div>
  );
}
