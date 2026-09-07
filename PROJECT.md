# Project Documentation

## 1. Project Overview
- **Description**: A high-performance, cinematic developer portfolio and classified digital workstation built for Zakariyae Boughaba (Full-Stack Web Developer). Departing from conventional template portfolios, this system is engineered as an interactive "digital dossier / operating system" featuring technical surveillance aesthetic, custom scanlines, ambient flashlight effects, interactive project case studies, and a bilingual content management system (CMS).
- **Target Audience & Purpose**:
  - **Audience**: Technical recruiters, engineering leads, enterprise clients, and international hiring teams seeking top-tier Full-Stack and Front-end development capabilities.
  - **Purpose**: Showcase deep technical proficiency in modern web architecture (Next.js 16, React 19, Laravel, TypeScript, Tailwind CSS, MongoDB, GSAP), demonstrate real-world case studies with verifiable evidence, and provide an administrative control center for real-time portfolio management.
- **Key Features & Functionalities**:
  - **Cinematic Technical Atmosphere**: Dark monochrome `#050505` foundation punctuated by `#FFAA00` amber telemetry, grain noise overlays, subtle scanline shaders, and an interactive ambient flashlight tracker.
  - **Sectional Dossier Architecture**:
    - `01 HERO (#hero)`: High-impact headline identity screen with availability badge, kinetic typography reveals, and smooth scroll guidance.
    - `02 PROFILE (#profile)`: Detailed dossier containing identity cards, bilingual bio summary, technical hard/soft skills matrices, timeline of education & enterprise experience, and direct CV download.
    - `03 PROJECTS (#projects)`: Dual-view project gallery (interactive horizontal slider & tactical grid) coupled with deep-dive SPA case study modals featuring architectural breakdowns, problem-solution narratives, and live evidence logs.
    - `04 CONTACT (#contact)`: Transmission hub featuring an interactive 2D radar coordinates map (Beni Mellal, Morocco / UTC+1), secure message dispatch pipeline, and direct direct encrypted communication channels (WhatsApp, GitHub, LinkedIn).
  - **Classified Master Admin Workstation (`/admin`)**: Single-admin authenticated control center allowing live bilingual editing (FR/EN) of hero statements, profile details, project evidence, and contact metadata.
  - **Bilingual Dynamic Data Engine**: Unified MongoDB data model serving English and French localized fields with automatic fallback mechanisms.
  - **Accessibility & Performance First**: Built-in `prefers-reduced-motion` compliance, GPU-accelerated GSAP timelines, memoized Data Access Layer (DAL) reads via React `cache()`, and responsive layouts.

---

## 2. Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.12](file:///home/zackweebdev/projects/portfolio-master-2026/package.json) (App Router architecture with React Server Components)
- **Core Library**: [React 19.2.4](file:///home/zackweebdev/projects/portfolio-master-2026/package.json) + React DOM 19
- **Styling**: [Tailwind CSS v4](file:///home/zackweebdev/projects/portfolio-master-2026/src/app/globals.css) with `@theme inline` CSS variable design tokens (`--color-amber`, `--color-surface`, `--z-flashlight`, etc.), custom scanline utilities, and `tw-animate-css`
- **Animations**: [GSAP 3.15.0](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/animations/gsap.ts) with `ScrollTrigger`, scoped context lifecycle management via custom [`useGSAP`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/hooks/useGSAP.ts), [`useReveal`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/hooks/useReveal.ts), and Framer Motion 12
- **Smooth Scroll**: [Lenis 1.3.25](file:///home/zackweebdev/projects/portfolio-master-2026/package.json)
- **State Management**: React state hooks (`useState`, `useReducer`), URL search params for view modes/language, and server-cached data layer
- **UI Components & Icons**: Custom design system built on [Base UI / Radix primitives](file:///home/zackweebdev/projects/portfolio-master-2026/package.json), [Lucide React 1.28](file:///home/zackweebdev/projects/portfolio-master-2026/package.json), [Embla Carousel 8.6](file:///home/zackweebdev/projects/portfolio-master-2026/package.json), and [Dotted Map 3.1](file:///home/zackweebdev/projects/portfolio-master-2026/package.json)

### Backend
- **API Routes**: Next.js App Router Route Handlers (`src/app/api/`)
- **Database**: MongoDB Atlas (Cloud NoSQL Cluster)
- **ORM/ODM**: [Mongoose 9.9.3](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/db/mongoose.ts) (cached schema-validated ODM) & Native [MongoDB Driver 7.6.0](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/db/mongodb.ts) (connection pool singleton)
- **Authentication**: [Better Auth 1.7.1](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/auth/auth.ts) with MongoDB Adapter, Server Actions, and Data Access Layer (DAL) guards
- **File Storage**: Cloudinary (Direct client-to-cloud signed upload pipeline)
- **Validation**: [Zod 4.4.3](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/auth/auth.actions.ts) (Strict schema validation for credentials, contact form, and API payloads)

---

## 3. Architecture Overview

### Folder Structure (`src/` Layout)

```text
portfolio-master-2026/
├── public/                     # Static media, resume PDFs, profile pictures, favicons
├── scripts/
│   ├── seed-admin.mjs          # Autonomous Better Auth admin creation script
│   └── seed-content.mjs        # Master bilingual MongoDB database seeder
├── src/
│   ├── app/                    # Next.js App Router (Routing, Layouts, API Handlers)
│   │   ├── (admin)/            # Route group for administrative portal
│   │   │   ├── access_bz_admin/page.tsx # Secure login terminal
│   │   │   ├── admin/page.tsx  # Master CMS workstation dashboard
│   │   │   └── layout.tsx      # Admin shell layout
│   │   ├── (public)/           # Public portfolio entry
│   │   │   └── page.tsx        # Main dynamic portfolio page (RSC)
│   │   ├── api/                # Next.js Route Handlers
│   │   │   ├── admin/content/  # Protected CMS REST endpoints (hero, profile, projects, contact)
│   │   │   ├── auth/[...all]/  # Better Auth wildcard handler
│   │   │   ├── cloudinary/sign/# Cloudinary signed signature generator
│   │   │   └── contact/        # Public transmission dispatcher
│   │   ├── globals.css         # Tailwind v4 theme, CSS tokens & atmosphere
│   │   ├── layout.tsx          # Root layout, fonts, metadata & client providers
│   │   ├── not-found.tsx       # Classified 404 terminal UI
│   │   ├── robots.ts           # SEO robots generator
│   │   └── sitemap.ts          # SEO sitemap generator
│   ├── backend/                # Server-Only Application Logic & Persistence Layer
│   │   ├── auth/               # Better Auth instance, client helper, Server Actions
│   │   ├── cloudinary/         # Cloudinary SDK & signature utilities
│   │   ├── dal/                # Data Access Layer (session verification, public content DAL)
│   │   ├── db/                 # Mongoose ODM & MongoDB Atlas connection pooling
│   │   ├── models/             # Mongoose schemas (PortfolioContent, Project)
│   │   └── validators/         # Zod schemas for API and mutations
│   ├── frontend/               # Presentation Layer (Client & UI Components)
│   │   ├── animations/         # GSAP entry point, ScrollTrigger, custom eases, durations
│   │   ├── components/         # Modular UI component tree
│   │   │   ├── admin/          # CMS editor workstation, sidebar, headers
│   │   │   ├── contact/        # Contact form, radar map, comms buttons
│   │   │   ├── cursor/         # Custom tactical cursor tracker
│   │   │   ├── flashlight/     # Ambient cursor flashlight overlay
│   │   │   ├── hero/           # Hero section, identity typography, availability
│   │   │   ├── layout/         # Header navigation, terminal footer, scanlines
│   │   │   ├── profile/        # Profile dossier, skills radar, experience cards
│   │   │   ├── projects/       # Project slider, grid, case study SPA modal
│   │   │   └── ui/             # Core primitives (buttons, badges, modals, carousels)
│   │   ├── hooks/              # Custom React hooks (useGSAP, useReveal, useReducedMotion)
│   │   ├── lib/                # Static fallback content and data helpers
│   │   ├── styles/             # Modular CSS layers (tokens, typography, environment)
│   │   └── types/              # Frontend TypeScript interfaces (projects, profile, hero)
│   └── shared/                 # Shared Cross-Cutting Utilities & Types
│       ├── constants/          # Application constants
│       ├── schemas/            # Universal schemas
│       └── types/              # Universal interfaces
├── components.json             # Shadcn component config
├── next.config.ts              # Next.js compiler & security settings
├── package.json                # Project dependencies and operational scripts
└── tsconfig.json               # TypeScript path alias configurations (@/* -> ./src/*)
```

### Frontend / Backend Separation Strategy

1. **Strict Server-Only Boundary**:
   - Backend files import `"server-only"` to prevent server code, database credentials, and ODM logic from ever leaking into client bundles.
   - The presentation layer (`src/frontend/`) remains pure React and communicates either via Server Component props or typed HTTP fetch calls to `/api/`.
2. **Data Access Layer (DAL)**:
   - Server-side data fetching bypasses external HTTP network hops by querying MongoDB directly via cached DAL functions (`getDynamicPortfolioData()`, `verifySession()`).
   - DAL operations enforce authorization, sanitize sensitive metadata, and guarantee serializable plain JavaScript objects.
3. **Server Actions vs Route Handlers**:
   - **Server Actions** (`auth.actions.ts`): Used for administrative mutations like `loginAdminAction()` and `logoutAdminAction()` with form validation.
   - **Route Handlers** (`src/app/api/`): Used for RESTful CRUD operations invoked by the interactive Admin CMS workstation and public contact form transmissions.

### Data Flow

```mermaid
flowchart TD
    subgraph Browser ["Client Runtime (Browser)"]
        User["Visitor / Admin User"]
        ClientComp["Client Components (Hero, Profile, Projects, Admin CMS)"]
        Forms["Forms & Modals (Contact, Case Study, Login)"]
    end

    subgraph RSC ["Next.js App Router (Server)"]
        Page["app/(public)/page.tsx (RSC)"]
        AdminPage["app/(admin)/admin/page.tsx (RSC)"]
        API["Route Handlers (src/app/api/*)"]
        Actions["Server Actions (auth.actions.ts)"]
    end

    subgraph DAL ["Data Access Layer (src/backend/dal)"]
        PubDAL["getDynamicPortfolioData(locale)"]
        AuthDAL["verifySession() / requireAdminAuth()"]
    end

    subgraph DB ["Persistence & External Services"]
        Mongoose["Mongoose Connection Pool (src/backend/db/mongoose.ts)"]
        MongoAtlas[("MongoDB Atlas Cluster")]
        Cloudinary[("Cloudinary Media CDN")]
    end

    User -->|Visits /| Page
    User -->|Visits /admin| AdminPage
    Page --> PubDAL
    AdminPage --> AuthDAL
    PubDAL --> Mongoose
    AuthDAL --> Mongoose
    Mongoose --> MongoAtlas
    PubDAL -->|Plain Objects JSON-safe| Page
    Page -->|Props| ClientComp

    Forms -->|POST /api/contact| API
    Forms -->|PUT /api/admin/content/*| API
    Forms -->|Server Action| Actions
    API --> AuthDAL
    API --> Mongoose
    Actions --> AuthDAL
    ClientComp -.->|Upload Images| Cloudinary
```

---

## 4. Database Schema

### 1. `PortfolioContent` Model (Single-Document Store)
The `PortfolioContent` collection uses a single-document pattern to store all global portfolio sections with bilingual French/English fields.

```typescript
// Localized string schema
const LocalizedStringSchema = new Schema(
  {
    fr: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false }
);

// Hero sub-schema
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

// Profile sub-schema
const ProfileSchema = new Schema(
  {
    header: {
      index: { type: String, default: "01" },
      label: LocalizedStringSchema,
      stamp: LocalizedStringSchema,
      systemRef: { type: String, default: "ZB-DOC-2026.1" },
    },
    identity: {
      fullName: { type: String, default: "ZAKARIYAE BOUGHABA" },
      roleTitle: LocalizedStringSchema,
      classCode: { type: String, default: "DEV_FULLSTACK" },
      location: { type: String, default: "Beni Mellal, Morocco (UTC+1)" },
      workMode: LocalizedStringSchema,
      availability: LocalizedStringSchema,
      profileImage: { type: String, default: "/assets/profile_optimized.jpg" },
      languages: { type: [String], default: ["Arabic (Native)", "English (B1)", "French (A2)"] },
    },
    summary: LocalizedStringSchema,
    education: [
      new Schema({
        institution: { type: String, required: true },
        period: { type: String, required: true },
        degree: LocalizedStringSchema,
        field: LocalizedStringSchema,
      }, { _id: true })
    ],
    experience: [
      new Schema({
        company: { type: String, required: true },
        role: LocalizedStringSchema,
        period: { type: String, required: true },
        stack: { type: [String], default: [] },
        description: LocalizedStringSchema,
      }, { _id: true })
    ],
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

// Contact sub-schema
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
    socialLinks: [
      new Schema({
        id: { type: String, required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        href: { type: String, required: true },
        platform: { type: String, default: "" },
      }, { _id: false })
    ],
  },
  { _id: false }
);
```

### 2. `Project` Model (Document Collection)
Each project / case study is an individual document supporting comprehensive telemetry, case studies, technologies, and ordering.

```typescript
const TechSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["backend", "frontend", "database", "tools", "other"], default: "other" },
    highlight: { type: Boolean, default: false },
  },
  { _id: false }
);

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
```

### 3. User, Account & Session Models (Better Auth)
Managed automatically inside MongoDB Atlas via the Better Auth MongoDB Adapter:
- `user`: Stores administrator ID, email, name, and hashed passwords.
- `account`: Stores authentication provider mapping and credentials.
- `session`: Stores active token IDs, user foreign keys, expiration dates, and IP/User-Agent metadata.

---

## 5. Authentication System

### Auth Provider & Strategy
- **Framework**: [Better Auth](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/auth/auth.ts) with `mongodbAdapter`.
- **Single-Admin Paradigm**: The platform operates with **zero public registration**. The system verifies credentials strictly against the designated administrator (`ADMIN_EMAIL`).
- **Session Management**: Secure HttpOnly, SameSite cookie sessions with a 7-day lifespan, 1-day rotation interval, and a 5-minute cookie cache.

### Protected Routes & Data Access Layer (DAL) Guards
Authentication verification is enforced in the Data Access Layer (`src/backend/dal/session.dal.ts`) utilizing React `cache()` to prevent redundant database lookups across nested layouts and components:

```typescript
// Memoized session check per request
export const verifySession = cache(async (): Promise<AdminSessionData | null> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session || !session.user) return null;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || "Administrator",
        role: "admin",
      },
      session: {
        id: session.session.id,
        userId: session.session.userId,
        expiresAt: session.session.expiresAt,
      },
    };
  } catch {
    return null;
  }
});

// Guard for Server Components
export async function requireAdminAuth(): Promise<AdminSessionData> {
  const sessionData = await verifySession();
  if (!sessionData) {
    redirect("/access_bz_admin");
  }
  return sessionData;
}

// Guard for API Route Handlers
export async function requireAdminApiAuth(): Promise<AdminSessionData | null> {
  return verifySession();
}
```

---

## 6. Admin Content Management

### CMS Features
- **Live Bilingual Switching**: Instant toggle between French (FR) and English (EN) content variants.
- **Section Modifiers**: Full CRUD control for:
  - **Hero Module**: Availability indicator, developer title, role headlines, and bio.
  - **Profile / Dossier Module**: Identity fields, career summaries, hard/soft skill tag management, education history, and employment records.
  - **Project Evidence Manager**: Project status (`completed`, `in-progress`, `concept`), technological stacks, GitHub/live links, and case study problem/solution narratives.
  - **Contact & Telemetry**: Email endpoints, availability status badges, and social media transmission links.
- **Media Pipeline**: Cloudinary client-side direct uploads with signed authorization to prevent API secret exposure.

### Admin Dashboard Layout (`/admin`)
- **Shell Structure**:
  - `AdminHeader`: System clearance indicator, language selector, and session termination trigger.
  - `AdminSidebar`: Multi-module selector (`SITE_CONTENT`, `CV_DATA_CORE`, `PROJECT_EVIDENCE`, `MEDIA_LIBRARY`, `SYSTEM_CONFIG`).
  - `AdminContentEditor`: Tabbed editor with real-time feedback and direct synchronization to MongoDB Atlas.

---

## 7. Animation System

### GSAP Architecture & SSR Safety
All animations originate from a centralized configuration module ([`src/frontend/animations/gsap.ts`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/animations/gsap.ts)) that registers plugins (`ScrollTrigger`) safely on the client runtime.

```typescript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: "power3.out",
    duration: 0.45,
  });
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

export { gsap, ScrollTrigger };
```

### Custom Hooks
1. **[`useGSAP`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/hooks/useGSAP.ts)**:
   - Scopes all selector queries to a component reference.
   - Cleans up timelines and kills memory-leaking ScrollTriggers on component unmount via `gsap.context().revert()`.
2. **[`useReveal`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/hooks/useReveal.ts)**:
   - Imperative reveal trigger supporting variants (`fade`, `up`, `clip`).
   - Connects seamlessly with ScrollTrigger or mount events.
3. **[`useReducedMotion`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/hooks/useReducedMotion.ts)**:
   - Reactively listens to `(prefers-reduced-motion: reduce)` and bypasses heavy transforms for users with accessibility preferences.

### Animation Categories
- **Hero Reveal**: Split-letter kinetic entry and telemetry badge fade-ins.
- **Dossier & Profile**: Staggered cards, sliding career timeline dividers, and expanding skills badges.
- **Project Gallery**: Embla carousel acceleration, horizontal slide easing, and modal zoom transitions.
- **Ambient Tactical Effects**: Interactive flashlight spotlight trailing cursor position (`Flashlight.tsx`), 2D radar sweep pulses, and custom cursor state changes (`useCursor.ts`).

---

## 8. API Endpoints

### Public Routes
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Home page (fetches dynamic content via Server DAL) | None |
| `POST` | `/api/contact` | Validates & queues visitor transmission | None |
| `GET` | `/api/test-db` | Database health & latency check | None |

### Admin Routes (Protected by `requireAdminApiAuth`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/content/hero` | Retrieve hero section data | Admin Session |
| `PUT` | `/api/admin/content/hero` | Update hero section data | Admin Session |
| `GET` | `/api/admin/content/profile` | Retrieve profile dossier data | Admin Session |
| `PUT` | `/api/admin/content/profile` | Update profile dossier data | Admin Session |
| `GET` | `/api/admin/content/projects`| Retrieve all project records | Admin Session |
| `PUT` | `/api/admin/content/projects/[id]` | Update project by database ID | Admin Session |
| `GET` | `/api/admin/content/contact` | Retrieve contact section configuration | Admin Session |
| `PUT` | `/api/admin/content/contact` | Update contact metadata & links | Admin Session |
| `POST`| `/api/cloudinary/sign` | Generate signed upload parameters | Admin Session |

### Authentication Routes (Better Auth Wildcard Handler)
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/sign-in/email` | Admin login endpoint |
| `POST` | `/api/auth/sign-out` | Admin session termination |
| `GET` | `/api/auth/session` | Inspect active session payload |
| `ALL` | `/api/auth/[...all]` | Better Auth internal route dispatch |

---

## 9. Environment Variables

### Required Variables
| Variable | Required | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB_NAME` | Yes | Target database name | `portfolio_master_db` |
| `BETTER_AUTH_SECRET` | Yes | Secret key used to encrypt session tokens | `64-character-hex-string` |
| `BETTER_AUTH_URL` | Yes | Base URL of the deployment | `http://localhost:3000` |
| `ADMIN_EMAIL` | Yes | Authorized administrator email | `zackwebdev56@gmail.com` |
| `ADMIN_PASSWORD` | Seed | Initial password for database seeding script | `AdminPassword123!` |
| `ADMIN_NAME` | No | Display name of the administrator | `Zakariyae Boughaba` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud identifier | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | No | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API Secret (server only) | `secret_string` |

### Example `.env.local`

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=portfolio_master_db

# Better Auth Configuration
BETTER_AUTH_SECRET=9f8e7d6c5b4a3928172635445566778899aabbccddeeff001122334455667788
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Administrator Credentials
ADMIN_EMAIL=zackwebdev56@gmail.com
ADMIN_PASSWORD=AdminSecure2026!
ADMIN_NAME=Zakariyae Boughaba

# Cloudinary Media Storage (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=zackwebdev-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
```

---

## 10. Component Library

### Key UI Components
- **[`Hero`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/components/hero/Hero.tsx)**: Headline screen with role typography, availability telemetry badge, and GSAP entry reveals.
- **[`ProfileSection`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/components/profile/ProfileSection.tsx)**: Dossier layout displaying subject specifications, education cards, interactive skills matrix, and career milestones.
- **[`ProjectsSection`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/components/projects/ProjectsSection.tsx)**: High-performance project gallery supporting view mode switching (horizontal Embla slider or structured grid).
- **[`ProjectDetailModal`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/components/projects/ProjectDetailModal.tsx)**: Full-featured SPA modal providing deep-dive case study analysis, architecture highlights, problem/solution breakdown, and live preview links.
- **[`ContactSection`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/components/contact/ContactSection.tsx)**: Encrypted transmission terminal with real-time form validation and interactive 2D coordinates radar.
- **[`Flashlight`](file:///home/zackweebdev/projects/portfolio-master-2026/src/frontend/components/flashlight/Flashlight.tsx)**: Radial canvas gradient following mouse coordinates to create a surveillance spotlight effect.

### Custom Hooks & Reusable Patterns
- **Hooks**:
  - `useGSAP()`: Context-safe animation lifecycle.
  - `useReveal()`: Scroll-triggered element entrance.
  - `useReducedMotion()`: OS accessibility listener.
  - `useActiveSection()`: Intersection observer tracking active header index (`01`, `02`, `03`, `04`).
  - `useCursor()`: Custom cursor styling and state tracking.
- **Design System Patterns**:
  - Technical header banners with classification codes (`ZB-DOC-2026.1`).
  - Monospaced badge chips for technologies and status indicators.
  - High-contrast amber accents (`#FFAA00`) on deep black surfaces (`#050505`).

---

## 11. Current State & Next Steps

### Completed Work
- Fully responsive, accessible, and high-performance Frontend UI (Hero, Profile, Projects, Contact, 404).
- Custom GSAP animation system with `ScrollTrigger` and reduced-motion safety.
- Master Mongoose schemas and single-document bilingual content engine.
- Better Auth integration with MongoDB Adapter and Data Access Layer guards.
- Admin workstation dashboard (`/admin`) and classified login terminal (`/access_bz_admin`).
- Database seeders for administrator creation and portfolio content population.
- **Resolved**: Next.js Server Component to Client Component serialization issue (ensured pure plain JSON objects without BSON `ObjectId` prototype methods).

### In Progress
- Implementation of the signed Cloudinary media upload endpoint (`/api/cloudinary/sign`).
- Integration of an SMTP/Resend email service for outgoing contact form transmissions.

### Immediate Priorities
1. Configure production Cloudinary upload widget in the Project Editor.
2. Connect production domain and configure custom security headers (Content Security Policy, Permissions Policy).
3. Execute end-to-end production build verification on target deployment infrastructure.

---

## 12. Development Workflow

### Local Setup Instructions

1. **Clone & Install Dependencies**:
   ```bash
   cd portfolio-master-2026
   npm install
   ```

2. **Configure Environment Variables**:
   Copy or create `.env.local` and provide your MongoDB Atlas URI and Better Auth secret.

3. **Seed Database**:
   ```bash
   # 1. Seed administrator credentials into MongoDB Atlas
   npm run admin:seed

   # 2. Seed bilingual portfolio content and projects
   npm run admin:seed-content
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   - Public Portfolio: [http://localhost:3000](http://localhost:3000)
   - Admin Login: [http://localhost:3000/access_bz_admin](http://localhost:3000/access_bz_admin)
   - Admin Workstation: [http://localhost:3000/admin](http://localhost:3000/admin)

### Build & Deployment Process
```bash
# Validate production bundle
npm run build

# Start production server
npm run start
```

---

## 13. Security Considerations

1. **Strict Data Access Layer Authorization**:
   - Protected API routes call `requireAdminApiAuth()` before performing database reads or mutations.
   - Protected Server Components invoke `requireAdminAuth()` which redirects unauthorized visitors to `/access_bz_admin`.
2. **Server-Only Isolation**:
   - Critical backend modules use `import "server-only"` to prevent database drivers and cryptographic secrets from entering client bundles.
3. **Defense Against Account Enumeration**:
   - Authentication actions return uniform generic errors (`ACCESS_DENIED`) for invalid usernames or passwords.
4. **Input Sanitization & Validation**:
   - All forms and route payloads are parsed and validated using strict Zod schemas with length limits and format regexes.
5. **RSC Plain Object Serialization**:
   - Data passed from Server Components to Client Components is sanitized to plain JSON objects, preventing prototype pollution and React Server Component serialization crashes.

---

## 14. Performance Optimizations

1. **Dual-Stack DNS Optimization**:
   - MongoDB and Mongoose connections explicitly enforce `family: 4` (IPv4) to avoid IPv6 connection timeouts in cloud environments.
2. **Connection Pooling & Singleton Caching**:
   - MongoDB and Mongoose connection instances are cached across hot module reloads (HMR) and serverless invocations.
3. **React `cache()` Memoization**:
   - DAL queries are memoized per request lifecycle, eliminating redundant round-trips when multiple layout components verify the session.
4. **GPU-Accelerated GSAP Animations**:
   - Visual effects utilize CSS `transform` (`x`, `y`, `scale`) and `opacity`, bypassing costly layout reflows.
5. **Asset Optimization**:
   - Cloudinary and Next.js Image component handle dynamic format conversions (WebP/AVIF) and responsive resolution scaling.

---

## 15. Critical Code Snippets

### 1. MongoDB & Mongoose Connection Setup ([`src/backend/db/mongoose.ts`](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/db/mongoose.ts))

```typescript
import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectMongoose(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in .env.local");

  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: process.env.MONGODB_DB_NAME || "portfolio_master_db",
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent IPv6 DNS timeouts
    };

    cached!.promise = mongoose.connect(uri, opts).then((instance) => instance);
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectMongoose;
```

### 2. Auth Configuration ([`src/backend/auth/auth.ts`](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/auth/auth.ts))

```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const secret = process.env.BETTER_AUTH_SECRET || "fallback_secret";

const client = mongoUri
  ? new MongoClient(mongoUri)
  : new MongoClient("mongodb://127.0.0.1:27017/portfolio_fallback");

const db = client.db(process.env.MONGODB_DB_NAME || "portfolio_master_db");

export const auth = betterAuth({
  secret,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,            // 5 minutes
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "portfolio_admin",
  },
  plugins: [nextCookies()],
});
```

### 3. Protected API Route Structure ([`src/app/api/admin/content/hero/route.ts`](file:///home/zackweebdev/projects/portfolio-master-2026/src/app/api/admin/content/hero/route.ts))

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { PortfolioContent } from "@/backend/models/PortfolioContent";

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const body = await req.json();

    const doc = await PortfolioContent.findOneAndUpdate(
      {},
      { $set: { hero: body.hero, updatedBy: auth.user.email } },
      { upsert: true, new: true, lean: true }
    );

    return NextResponse.json({ success: true, hero: doc?.hero ?? null });
  } catch (err: any) {
    console.error("[API_HERO_PUT_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### 4. Frontend-Backend Data Fetching Pattern ([`src/backend/dal/publicContent.ts`](file:///home/zackweebdev/projects/portfolio-master-2026/src/backend/dal/publicContent.ts))

```typescript
export async function getDynamicPortfolioData(locale: Locale = "en") {
  try {
    await connectMongoose();

    const [contentDoc, dbProjects] = await Promise.all([
      PortfolioContent.findOne({}).lean(),
      ProjectModel.find({ published: { $ne: false } }).sort({ "metadata.order": 1 }).lean(),
    ]);

    // Map projects and sanitize subdocuments (stripping BSON ObjectIds)
    const projects: Project[] = dbProjects.map((dp: any) => ({
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
      metadata: {
        evidenceId: dp.metadata?.evidenceId || "EVIDENCE",
        year: dp.metadata?.year || "2026",
        client: dp.metadata?.client || "",
        featured: dp.metadata?.featured ?? false,
        order: dp.metadata?.order ?? 999,
      },
    }));

    // Return pure JSON-serializable plain object across RSC boundary
    return JSON.parse(JSON.stringify({
      hero: mappedHero,
      profile: mappedProfile,
      projects,
      contact: mappedContact,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic portfolio content:", error);
    return {
      hero: defaultHeroContent,
      profile: defaultProfileContent,
      projects: PROJECTS_DATA,
      contact: null,
    };
  }
}
```
