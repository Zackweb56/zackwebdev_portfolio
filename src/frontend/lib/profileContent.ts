/**
 * Profile Content — Static Data Layer
 *
 * Sourced directly from Zakariyae Boughaba's CV and portfolio dossier specification.
 */

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  stack?: string[];
  description: string;
}

export interface EducationItem {
  institution: string;
  period: string;
  degree: string;
  field: string;
}

export interface ProfileContent {
  header: {
    index: string;
    label: string;
    stamp: string;
    systemRef: string;
  };
  identity: {
    fullName: string;
    roleTitle: string;
    classCode: string;
    location: string;
    workMode: string;
    availability: string;
    profileImage: string;
    languages: string[];
  };
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  hardSkills: string[];
  softSkills: string[];
  resume: {
    label: string;
    href: string;
    downloadFilename: string;
  };
}

export const defaultProfileContent: ProfileContent = {
  header: {
    index: "01",
    label: "PROFILE",
    stamp: "DOSSIER // SUBJECT SPECIFICATION",
    systemRef: "ZB-DOC-2026.1",
  },
  identity: {
    fullName: "ZAKARIYAE BOUGHABA",
    roleTitle: "FULL-STACK WEB DEVELOPER",
    classCode: "DEV_FULLSTACK",
    location: "Beni Mellal, Morocco (UTC+1)",
    workMode: "REMOTE WORK WORLDWIDE",
    availability: "OPEN TO WORK",
    profileImage: "/assets/profile_optimized.jpg",
    languages: ["Arabic (Native)", "English (B1)", "French (A2)"],
  },
  summary:
    "Full-Stack Web Developer focused on building scalable, reliable, and high-performance web applications using Laravel, Next.js, and React. Passionate about clean backend architecture and delivering seamless, accessible user experiences.",
  education: [
    {
      institution: "ISTA NTIC BENI MELLAL",
      period: "2021 — 2023",
      degree: "Technicien Spécialisé",
      field: "Diploma in Digital Development (Full-Stack Web Development)",
    },
    {
      institution: "LYCEE IBN TOFAIL",
      period: "2020 — 2021",
      degree: "Baccalaureate",
      field: "Physical and Chemical Sciences",
    },
  ],
  experience: [
    {
      company: "LICORNE CONSULTING-TRAINING",
      role: "Full-Stack Web Developer",
      period: "Mar 2025 — Aug 2025",
      stack: ["Laravel 12", "Tailwind CSS", "AJAX", "MySQL"],
      description:
        "Engineered document automation pipeline converting DOCX/PPTX to company templates, quotation generator & analytics dashboard.",
    },
    {
      company: "HEDOMA GROUPE",
      role: "Full-Stack Web Developer",
      period: "Sep 2024 — Jan 2025",
      stack: ["Laravel 10", "Bootstrap", "jQuery", "MySQL", "cPanel"],
      description:
        "Engineered and deployed web applications on cPanel hosting, database optimization, and server configuration.",
    },
    {
      company: "MAROC-PUB",
      role: "Front-end Developer",
      period: "Feb 2024 — Jun 2024",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
      description:
        "Developed responsive, accessible, and type-safe UI interfaces for an online commercial rental platform.",
    },
  ],
  hardSkills: [
    "Next.js",
    "React.js",
    "TypeScript",
    "JavaScript",
    "Laravel",
    "PHP",
    "Tailwind CSS",
    "Node.js",
    "MySQL",
    "MongoDB",
    "REST APIs",
    "Docker",
    "Git / GitHub",
    "cPanel",
    "Livewire",
    "Alpine.js",
    "shadcn/ui",
    "SQL",
  ],
  softSkills: [
    "Problem Solving",
    "System Architecture",
    "Adaptability & Speed",
    "Teamwork & Collaboration",
    "Self-Motivation & Learning",
    "Critical Thinking",
  ],
  resume: {
    label: "VIEW & DOWNLOAD CV",
    href: "/assets/Zakariyae_Boughaba_CV.pdf",
    downloadFilename: "Zakariyae_Boughaba_FullStack_Resume.pdf",
  },
};
