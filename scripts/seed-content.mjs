/**
 * seed-content.mjs
 * Seeds bilingual Hero, Profile, Contact + Projects into MongoDB Atlas.
 * Pure ESM + mongoose — no TS compilation required.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ───────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (t && !t.startsWith("#")) {
      const idx = t.indexOf("=");
      if (idx !== -1) {
        const key = t.slice(0, idx).trim();
        const val = t.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME  = process.env.MONGODB_DB_NAME || "portfolio_master_db";

if (!MONGO_URI) { console.error("❌  MONGODB_URI not set"); process.exit(1); }

// ── Inline schemas (no TS import needed) ─────────────────────────────────────
const { Schema, model, models, connection } = mongoose;

const L = { fr: { type: String, default: "" }, en: { type: String, default: "" } };

const PortfolioContentSchema = new Schema(
  {
    hero: {
      availability: L, nameFirst: String, nameLast: String,
      role: L, bio: L, scrollLabel: L,
    },
    profile: {
      header: { index: String, label: L, stamp: L, systemRef: String },
      identity: {
        fullName: String, roleTitle: L, classCode: String,
        location: String, workMode: L, availability: L,
        profileImage: String, languages: [String],
      },
      summary: L,
      education: [{
        institution: String, period: String,
        degree: L, field: L,
      }],
      experience: [{
        company: String, role: L, period: String,
        stack: [String], description: L,
      }],
      hardSkills: [String],
      softSkills: [String],
      resume: { label: L, href: String, downloadFilename: String },
    },
    contact: {
      email: String, headline: L, availabilityBadge: L,
      locationCity: String, locationCountry: String,
      mapCoords: { lat: Number, lng: Number },
      socialLinks: [new Schema({ id: String, name: String, code: String, href: String, platform: String }, { _id: false })],
    },
  },
  { timestamps: true }
);

const TechSchema = new Schema(
  { name: String, category: String, highlight: Boolean },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    projectId: { type: String, unique: true },
    slug: { type: String, unique: true },
    title: L, shortTitle: L,
    category: String, status: String,
    shortDescription: L, fullDescription: L,
    thumbnailSrc: String, thumbnailAlt: L,
    technologies: [TechSchema],
    links: { github: String, live: String, demo: String },
    caseStudy: {
      overview: L, problem: L, solution: L, role: L, duration: L,
      architectureHighlights: [String], keyFeatures: [String], results: L,
    },
    metadata: { evidenceId: String, year: String, client: String, featured: Boolean, order: Number },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PortfolioContent = models.PortfolioContent || model("PortfolioContent", PortfolioContentSchema);
const Project = models.Project || model("Project", ProjectSchema);

// ── Connect ───────────────────────────────────────────────────────────────────
console.log("🔗  Connecting to MongoDB Atlas...");
await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
console.log(`✅  Connected to: ${DB_NAME}`);

// ── Seed PortfolioContent ─────────────────────────────────────────────────────
const existing = await PortfolioContent.findOne({});
if (existing) {
  console.log("ℹ️   PortfolioContent document already exists — skipping.");
} else {
  await PortfolioContent.create({
    hero: {
      availability: { fr: "Ouvert aux opportunités", en: "Open to opportunities" },
      nameFirst: "Zakariyae",
      nameLast: "Boughaba",
      role: { fr: "Développeur Web Full Stack", en: "Full Stack Web Developer" },
      bio: {
        fr: "Je conçois et développe des applications web full-stack fiables avec une architecture propre, des performances optimales et des interactions utilisateur soignées.",
        en: "I design and engineer reliable full-stack web applications with a focus on clean architecture, performance, and thoughtful user interaction.",
      },
      scrollLabel: { fr: "Explorer", en: "Explore" },
    },
    profile: {
      header: {
        index: "01",
        label: { fr: "PROFIL", en: "PROFILE" },
        stamp: { fr: "DOSSIER // SPÉCIFICATION SUJET", en: "DOSSIER // SUBJECT SPECIFICATION" },
        systemRef: "ZB-DOC-2026.1",
      },
      identity: {
        fullName: "ZAKARIYAE BOUGHABA",
        roleTitle: { fr: "DÉVELOPPEUR WEB FULL-STACK", en: "FULL-STACK WEB DEVELOPER" },
        classCode: "DEV_FULLSTACK",
        location: "Beni Mellal, Morocco (UTC+1)",
        workMode: { fr: "TÉLÉTRAVAIL INTERNATIONAL", en: "REMOTE WORK WORLDWIDE" },
        availability: { fr: "DISPONIBLE", en: "OPEN TO WORK" },
        profileImage: "/assets/profile_optimized.jpg",
        languages: ["Arabic (Native)", "English (B1)", "French (A2)"],
      },
      summary: {
        fr: "Développeur Web Full-Stack spécialisé dans la création d'applications web scalables, fiables et performantes avec Laravel, Next.js et React. Passionné par l'architecture backend propre et les expériences utilisateur accessibles.",
        en: "Full-Stack Web Developer focused on building scalable, reliable, and high-performance web applications using Laravel, Next.js, and React. Passionate about clean backend architecture and delivering seamless, accessible user experiences.",
      },
      education: [
        {
          institution: "ISTA NTIC BENI MELLAL", period: "2021 — 2023",
          degree: { fr: "Technicien Spécialisé", en: "Specialized Technician" },
          field: { fr: "Diplôme en Développement Digital (Web Full-Stack)", en: "Diploma in Digital Development (Full-Stack Web Development)" },
        },
        {
          institution: "LYCEE IBN TOFAIL", period: "2020 — 2021",
          degree: { fr: "Baccalauréat", en: "Baccalaureate" },
          field: { fr: "Sciences Physiques et Chimiques", en: "Physical and Chemical Sciences" },
        },
      ],
      experience: [
        {
          company: "LICORNE CONSULTING-TRAINING",
          role: { fr: "Développeur Web Full-Stack", en: "Full-Stack Web Developer" },
          period: "Mar 2025 — Aug 2025",
          stack: ["Laravel 12", "Tailwind CSS", "AJAX", "MySQL"],
          description: {
            fr: "Pipeline d'automatisation de documents DOCX/PPTX, générateur de devis Excel et tableau de bord analytique.",
            en: "Engineered document automation pipeline converting DOCX/PPTX to company templates, quotation generator & analytics dashboard.",
          },
        },
        {
          company: "HEDOMA GROUPE",
          role: { fr: "Développeur Web Full-Stack", en: "Full-Stack Web Developer" },
          period: "Sep 2024 — Jan 2025",
          stack: ["Laravel 10", "Bootstrap", "jQuery", "MySQL", "cPanel"],
          description: {
            fr: "Déploiement d'applications web sur hébergement cPanel, optimisation de bases de données et configuration serveur.",
            en: "Engineered and deployed web applications on cPanel hosting, database optimization, and server configuration.",
          },
        },
        {
          company: "MAROC-PUB",
          role: { fr: "Développeur Front-end", en: "Front-end Developer" },
          period: "Feb 2024 — Jun 2024",
          stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
          description: {
            fr: "Développement d'interfaces responsive et accessibles pour une plateforme de location commerciale en ligne.",
            en: "Developed responsive, accessible, and type-safe UI interfaces for an online commercial rental platform.",
          },
        },
      ],
      hardSkills: [
        "Next.js","React.js","TypeScript","JavaScript","Laravel","PHP",
        "Tailwind CSS","Node.js","MySQL","MongoDB","REST APIs",
        "Docker","Git / GitHub","cPanel","Livewire","Alpine.js","shadcn/ui","SQL",
      ],
      softSkills: [
        "Problem Solving","System Architecture","Adaptability & Speed",
        "Teamwork & Collaboration","Self-Motivation & Learning","Critical Thinking",
      ],
      resume: {
        label: { fr: "VOIR ET TÉLÉCHARGER CV", en: "VIEW & DOWNLOAD CV" },
        href: "/assets/Zakariyae_Boughaba_CV.pdf",
        downloadFilename: "Zakariyae_Boughaba_FullStack_Resume.pdf",
      },
    },
    contact: {
      email: "zackwebdev56@gmail.com",
      headline: { fr: "Et si nous travaillions ensemble ?", en: "What if we worked together?" },
      availabilityBadge: { fr: "DISPONIBLE POUR DU TRAVAIL", en: "AVAILABLE FOR WORK" },
      locationCity: "Beni Mellal",
      locationCountry: "Morocco",
      mapCoords: { lat: 32.34, lng: -6.35 },
      socialLinks: [
        { id: "whatsapp", name: "WHATSAPP", code: "WA // DIRECT", href: "https://wa.me/212620719875?text=Hello%20Zakariyae%2C%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect.", platform: "whatsapp" },
        { id: "github",   name: "GITHUB",   code: "GH // REPO",   href: "https://github.com/Zackweb56",  platform: "github"   },
        { id: "linkedin", name: "LINKEDIN", code: "IN // NETWORK", href: "https://www.linkedin.com/in/zakariyae-boughaba", platform: "linkedin" },
      ],
    },
  });
  console.log("✅  PortfolioContent seeded.");
}

// ── Seed Projects ─────────────────────────────────────────────────────────────
const projectCount = await Project.countDocuments();
if (projectCount > 0) {
  console.log(`ℹ️   ${projectCount} project(s) already in DB — skipping.`);
} else {
  await Project.insertMany([
    {
      projectId: "proj-01", slug: "dental-clinic-management-system",
      title: { fr: "Système de Gestion de Cabinet Dentaire", en: "Dental Clinic Management System" },
      shortTitle: { fr: "Cabinet Dentaire OS", en: "Dental Clinic OS" },
      category: "enterprise", status: "completed",
      shortDescription: {
        fr: "Plateforme complète de gestion de cabinet dentaire pour dossiers patients, planification de rendez-vous et facturation automatisée.",
        en: "Comprehensive dental clinic operations platform for patient records, appointment scheduling, and automated billing workflows.",
      },
      fullDescription: {
        fr: "Une plateforme médicale moderne développée avec Laravel 12, Livewire et Alpine.js.",
        en: "A modern medical management platform engineered with Laravel 12, Livewire, and Alpine.js.",
      },
      thumbnailSrc: "", thumbnailAlt: { fr: "Interface de gestion dentaire", en: "Dental Clinic Platform Interface" },
      technologies: [
        { name: "Laravel 12", category: "backend", highlight: true },
        { name: "Livewire",   category: "frontend", highlight: true },
        { name: "Alpine.js",  category: "frontend", highlight: false },
        { name: "Tailwind CSS", category: "frontend", highlight: false },
        { name: "MySQL",      category: "database", highlight: true  },
        { name: "PHP",        category: "backend",  highlight: false },
      ],
      links: { github: "https://github.com/Zackweb56", live: "", demo: "" },
      caseStudy: {
        overview: { fr: "Outil de gestion de cabinet dentaire pour numériser les workflows cliniques.", en: "Healthcare management tool built to digitize clinic workflows." },
        problem:  { fr: "Dossiers fragmentés et planification manuelle des rendez-vous.", en: "Fragmented record keeping and manual appointment scheduling." },
        solution: { fr: "Architecture SPA réactive avec Livewire et Alpine.js sur Laravel 12.", en: "Reactive SPA architecture using Livewire and Alpine.js atop Laravel 12." },
        role:     { fr: "Lead Développeur Full-Stack", en: "Lead Full-Stack Developer" },
        duration: { fr: "3 Mois", en: "3 Months" },
        architectureHighlights: ["Livewire 3 reactive component architecture","Optimized MySQL schema","Multi-role RBAC security","Automated PDF report generator"],
        keyFeatures: ["Interactive Dental Odontogram","Real-time Appointment Scheduling","Patient Medical Dossier","Automated Invoicing & Revenue Analytics"],
        results: { fr: "Réduction des frais de planification de 65%.", en: "Reduced appointment scheduling overhead by 65%." },
      },
      metadata: { evidenceId: "EVIDENCE // 01", year: "2025", client: "Healthcare / Dental Practice", featured: true, order: 1 },
      published: true,
    },
    {
      projectId: "proj-02", slug: "licorne-document-automation",
      title: { fr: "Moteur d'Automatisation de Documents & Analytique", en: "Document Automation & Analytics Engine" },
      shortTitle: { fr: "Suite Automatisation", en: "Doc Automation Suite" },
      category: "enterprise", status: "completed",
      shortDescription: {
        fr: "Pipeline de traitement de documents convertissant DOCX/PPTX en modèles d'entreprise avec devis Excel automatisés.",
        en: "Enterprise document processing pipeline converting DOCX/PPTX into company templates with automated Excel quotations.",
      },
      fullDescription: {
        fr: "Suite d'automatisation interne pour Licorne consulting-training.",
        en: "Internal document automation suite for Licorne consulting-training.",
      },
      thumbnailSrc: "", thumbnailAlt: { fr: "Schéma du pipeline", en: "Document Pipeline Schematic" },
      technologies: [
        { name: "Laravel 12",       category: "backend",  highlight: true  },
        { name: "Tailwind CSS",     category: "frontend", highlight: false },
        { name: "AJAX",             category: "frontend", highlight: false },
        { name: "MySQL",            category: "database", highlight: true  },
        { name: "Office Automation",category: "tools",    highlight: false },
      ],
      links: { github: "https://github.com/Zackweb56", live: "", demo: "" },
      caseStudy: {
        overview: { fr: "Moteur d'automatisation de documents pour Licorne.", en: "Document automation engine for Licorne consulting-training." },
        problem:  { fr: "Des centaines d'heures manuelles pour les devis.", en: "Hundreds of manual hours drafting client quotations." },
        solution: { fr: "Parser haute performance en Laravel 12.", en: "High-throughput parser in Laravel 12." },
        role:     { fr: "Développeur Full-Stack", en: "Full-Stack Web Developer" },
        duration: { fr: "5 Mois (Mar 2025 – Août 2025)", en: "5 Months (Mar 2025 – Aug 2025)" },
        architectureHighlights: ["DOCX/PPTX transformation service","Dynamic quotation algorithm","Async AJAX analytics dashboard"],
        keyFeatures: ["Automated DOCX/PPTX Template Synthesis","One-click Excel Quotation Generation","Live Executive Dashboard","Activity Audit Log"],
        results: { fr: "Préparation des devis de plusieurs heures à quelques secondes.", en: "Quotation preparation time reduced from hours to seconds." },
      },
      metadata: { evidenceId: "EVIDENCE // 02", year: "2025", client: "Licorne consulting-training", featured: true, order: 2 },
      published: true,
    },
    {
      projectId: "proj-03", slug: "expiration-date-management-system",
      title: { fr: "Système de Suivi des Dates d'Expiration & Rappels", en: "Expiration Date & Recall Tracking System" },
      shortTitle: { fr: "Suivi Expiration", en: "Expiration Tracker" },
      category: "system", status: "completed",
      shortDescription: {
        fr: "Plateforme logistique automatisée pour surveiller les cycles de vie des produits périssables, les rappels de lots et les alertes automatiques.",
        en: "Automated logistics inventory platform for monitoring perishable product lifecycles, batch recalls, and automated notification alerts.",
      },
      fullDescription: {
        fr: "Application de gestion de la chaîne d'approvisionnement avec Laravel 10, MySQL et planification CRON automatisée.",
        en: "A supply-chain management application engineered with Laravel 10, MySQL, and automated CRON scheduling.",
      },
      thumbnailSrc: "", thumbnailAlt: { fr: "Interface système de suivi", en: "Expiration Tracking System Interface" },
      technologies: [
        { name: "Laravel 10", category: "backend",  highlight: true  },
        { name: "MySQL",      category: "database", highlight: true  },
        { name: "Bootstrap",  category: "frontend", highlight: false },
        { name: "jQuery",     category: "frontend", highlight: false },
        { name: "PHP",        category: "backend",  highlight: false },
      ],
      links: { github: "https://github.com/Zackweb56", live: "", demo: "" },
      caseStudy: {
        overview: { fr: "Système de suivi pour automatiser la gestion des produits périssables.", en: "Tracking system to automate perishable product lifecycle management." },
        problem:  { fr: "Suivi manuel entraînant des pertes et des rappels tardifs.", en: "Manual tracking leading to product losses and delayed recalls." },
        solution: { fr: "Système automatisé avec alertes CRON et tableau de bord en temps réel.", en: "Automated system with CRON alerts and real-time dashboard." },
        role:     { fr: "Développeur Full-Stack", en: "Full-Stack Developer" },
        duration: { fr: "2 Mois", en: "2 Months" },
        architectureHighlights: ["CRON-based expiry monitoring","Batch recall management","Multi-warehouse inventory tracking"],
        keyFeatures: ["Perishable Lifecycle Tracking","Automated Batch Recall Alerts","Warehouse Inventory Dashboard","Supervisor Notifications"],
        results: { fr: "Réduction des pertes produits de 40% grâce aux alertes automatiques.", en: "Reduced product loss by 40% through automated expiry alerts." },
      },
      metadata: { evidenceId: "EVIDENCE // 03", year: "2024", client: "Logistics / Supply Chain", featured: false, order: 3 },
      published: true,
    },
  ]);
  console.log("✅  Projects seeded (3 entries).");
}

await connection.close();
console.log("🏁  Seeding complete.");
