import mongoose, { Schema, Model } from "mongoose";

/**
 * PortfolioContent — Master MongoDB Schema
 *
 * Stores all portfolio content in a bilingual structure (FR/EN).
 * Single-document strategy: one document holds the entire portfolio content.
 * Admin dashboard reads/writes to this via the Content Management layer.
 */

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

const LocalizedStringSchema = new Schema(
  {
    fr: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false }
);

// Hero
const HeroSchema = new Schema(
  {
    availability: LocalizedStringSchema,
    nameFirst: { type: String, default: "Zakariyae" },
    nameLast: { type: String, default: "Boughaba" },
    role: LocalizedStringSchema,
    bio: LocalizedStringSchema,
    scrollLabel: LocalizedStringSchema,
  },
  { _id: false }
);

// Profile Identity
const IdentitySchema = new Schema(
  {
    fullName: { type: String, default: "ZAKARIYAE BOUGHABA" },
    roleTitle: LocalizedStringSchema,
    classCode: { type: String, default: "DEV_FULLSTACK" },
    location: { type: String, default: "Beni Mellal, Morocco (UTC+1)" },
    workMode: LocalizedStringSchema,
    availability: LocalizedStringSchema,
    profileImage: { type: String, default: "/assets/profile_optimized.jpg" },
    languages: { type: [String], default: ["Arabic (Native)", "English (B1)", "French (A2)"] },
  },
  { _id: false }
);

// Education
const EducationItemSchema = new Schema(
  {
    institution: { type: String, required: true },
    period: { type: String, required: true },
    degree: LocalizedStringSchema,
    field: LocalizedStringSchema,
  },
  { _id: true }
);

// Experience
const ExperienceItemSchema = new Schema(
  {
    company: { type: String, required: true },
    role: LocalizedStringSchema,
    period: { type: String, required: true },
    stack: { type: [String], default: [] },
    description: LocalizedStringSchema,
  },
  { _id: true }
);

// Profile
const ProfileSchema = new Schema(
  {
    header: {
      index: { type: String, default: "01" },
      label: LocalizedStringSchema,
      stamp: LocalizedStringSchema,
      systemRef: { type: String, default: "ZB-DOC-2026.1" },
    },
    identity: IdentitySchema,
    summary: LocalizedStringSchema,
    education: [EducationItemSchema],
    experience: [ExperienceItemSchema],
    hardSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    resume: {
      label: LocalizedStringSchema,
      href: { type: String, default: "/assets/Zakariyae_Boughaba_CV.pdf" },
      downloadFilename: { type: String, default: "Zakariyae_Boughaba_FullStack_Resume.pdf" },
    },
  },
  { _id: false }
);

// Project Technology
const TechSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["backend", "frontend", "database", "tools", "other"], default: "other" },
    highlight: { type: Boolean, default: false },
  },
  { _id: false }
);

// Project Case Study
const CaseStudySchema = new Schema(
  {
    overview: LocalizedStringSchema,
    problem: LocalizedStringSchema,
    solution: LocalizedStringSchema,
    role: LocalizedStringSchema,
    duration: LocalizedStringSchema,
    architectureHighlights: { type: [String], default: [] },
    keyFeatures: { type: [String], default: [] },
    results: LocalizedStringSchema,
  },
  { _id: false }
);

// Project
const ProjectSchema = new Schema(
  {
    projectId: { type: String, required: true, unique: true }, // e.g. "proj-01"
    slug: { type: String, required: true, unique: true },
    title: LocalizedStringSchema,
    shortTitle: LocalizedStringSchema,
    category: { type: String, enum: ["enterprise", "system", "web", "other"], default: "other" },
    status: { type: String, enum: ["completed", "in-progress", "concept"], default: "completed" },
    shortDescription: LocalizedStringSchema,
    fullDescription: LocalizedStringSchema,
    thumbnailSrc: { type: String, default: "" },
    thumbnailAlt: LocalizedStringSchema,
    technologies: [TechSchema],
    links: {
      github: { type: String, default: "" },
      live: { type: String, default: "" },
      demo: { type: String, default: "" },
    },
    caseStudy: CaseStudySchema,
    metadata: {
      evidenceId: { type: String, default: "" },
      year: { type: String, default: "" },
      client: { type: String, default: "" },
      featured: { type: Boolean, default: false },
      order: { type: Number, default: 999 },
    },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Contact
const SocialLinkSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    href: { type: String, required: true },
    platform: { type: String, default: "" },
  },
  { _id: false }
);

const ContactSchema = new Schema(
  {
    email: { type: String, default: "zackwebdev56@gmail.com" },
    headline: LocalizedStringSchema,
    availabilityBadge: LocalizedStringSchema,
    locationCity: { type: String, default: "Beni Mellal" },
    locationCountry: { type: String, default: "Morocco" },
    mapCoords: {
      lat: { type: Number, default: 32.34 },
      lng: { type: Number, default: -6.35 },
    },
    socialLinks: [SocialLinkSchema],
  },
  { _id: false }
);

// ─── Master Portfolio Content Schema ─────────────────────────────────────────

interface IPortfolioContent {
  _id?: mongoose.Types.ObjectId;
  hero: typeof HeroSchema;
  profile: typeof ProfileSchema;
  contact: typeof ContactSchema;
  updatedAt?: Date;
  updatedBy?: string;
}

const PortfolioContentSchema = new Schema<IPortfolioContent>(
  {
    hero: { type: HeroSchema, default: {} },
    profile: { type: ProfileSchema, default: {} },
    contact: { type: ContactSchema, default: {} },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

// ─── Model exports ────────────────────────────────────────────────────────────

export const PortfolioContent: Model<IPortfolioContent> =
  mongoose.models.PortfolioContent ||
  mongoose.model<IPortfolioContent>("PortfolioContent", PortfolioContentSchema);

export const Project: Model<any> =
  mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);

export type { IPortfolioContent };
