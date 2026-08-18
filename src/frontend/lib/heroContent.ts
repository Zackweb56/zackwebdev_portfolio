/**
 * Hero Content — Static Data Layer
 *
 * ─── BACKEND MIGRATION GUIDE ────────────────────────────────────────────────
 * When you start backend tasks, replace `defaultHeroContent` with a server
 * fetch from your API/DB. The shape of `HeroContent` below is the contract
 * your API response must match.
 *
 * Example (Next.js Server Component):
 *   const content = await fetch('/api/hero').then(r => r.json()) as HeroContent;
 *
 * Example (Server Action / Prisma):
 *   const content = await db.heroContent.findFirst() as HeroContent;
 * ────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HeroContent {
  /** Short status indicator shown in the pill badge at the top */
  availability: string;

  /** Developer full name — split for individual styling */
  name: {
    first: string;
    last: string;
  };

  /** Professional title / role headline */
  role: string;

  /** One-sentence positioning bio shown below the role */
  bio: string;

  /** Text label on the scroll-down cue */
  scrollLabel: string;
}

// ─── Static Data (edit here until backend is ready) ──────────────────────────

export const defaultHeroContent: HeroContent = {
  availability: "Open to opportunities",

  name: {
    first: "Zakariyae",
    last: "Boughaba",
  },

  role: "Full Stack Web Developer",

  bio: "I design and engineer reliable full-stack web applications with a focus on clean architecture, performance, and thoughtful user interaction.",

  scrollLabel: "Explore",
};
