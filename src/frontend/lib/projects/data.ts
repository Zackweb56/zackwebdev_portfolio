/**
 * ─── Projects Local Dataset ──────────────────────────────────────────────────
 *
 * Sourced directly from Zakariyae Boughaba's authentic project records and CV data.
 * Structured for consumption by the Projects Registry, Gallery, and Case Study routes.
 */

import { Project } from "@/frontend/types/project";

export const PROJECTS_DATA: Project[] = [
  {
    id: "proj-01",
    slug: "dental-clinic-management-system",
    title: "Dental Clinic Management System",
    shortTitle: "Dental Clinic OS",
    category: "enterprise",
    status: "completed",
    shortDescription:
      "Comprehensive dental clinic operations platform for patient records, appointment scheduling, and automated billing workflows.",
    fullDescription:
      "A modern medical management platform engineered with Laravel 12, Livewire, and Alpine.js. Streamlines patient care pathways, appointment calendars, prescription history, medical charts, billing, and operational metrics.",
    thumbnail: {
      src: undefined, // Demonstrates technical fallback architecture
      alt: "Dental Clinic Management Platform Interface Architecture",
      type: "image",
      fallbackVariant: "schematic",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Laravel 12", category: "backend", highlight: true },
      { name: "Livewire", category: "frontend", highlight: true },
      { name: "Alpine.js", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "Flux UI", category: "frontend" },
      { name: "MySQL", category: "database", highlight: true },
      { name: "PHP", category: "backend" },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "The Dental Clinic Management System is a specialized healthcare management tool built to digitize clinic workflows, eliminate manual record-keeping bottlenecks, and provide real-time patient queue monitoring.",
      problem:
        "Traditional dental practices face fragmented record keeping across physical charts, manual appointment scheduling with high no-show rates, and delayed invoicing reconciliations.",
      solution:
        "Engineered a reactive single-page architecture using Livewire and Alpine.js atop Laravel 12, delivering instantaneous appointment booking, interactive odontogram charting, and unified invoicing pipelines.",
      role: "Lead Full-Stack Developer — Architectural design, database schema, Livewire reactive components, billing workflow.",
      duration: "3 Months",
      architectureHighlights: [
        "Reactive Livewire 3 component architecture with Alpine.js state synchronization",
        "Optimized MySQL schema with indexing on patient appointment timestamps and invoice lookups",
        "Multi-role RBAC security for receptionists, dental hygienists, and head practitioners",
        "Automated PDF medical report & prescription generator with digital verification stamps",
      ],
      keyFeatures: [
        "Interactive Dental Odontogram & Treatment Planning",
        "Real-time Calendar & Appointment Scheduling Queue",
        "Comprehensive Patient Medical Dossier & Radiography Records",
        "Automated Invoicing, Payment Tracking & Revenue Analytics",
      ],
      results:
        "Reduced appointment scheduling overhead by 65% and eliminated duplicate medical filing through normalized relational database modeling.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 01",
      year: "2025",
      client: "Healthcare / Dental Practice",
      featured: true,
      order: 1,
    },
  },
  {
    id: "proj-02",
    slug: "licorne-document-automation",
    title: "Document Automation & Analytics Engine",
    shortTitle: "Doc Automation Suite",
    category: "enterprise",
    status: "completed",
    shortDescription:
      "Enterprise document processing pipeline converting DOCX/PPTX into company templates with automated Excel quotations and analytics.",
    fullDescription:
      "Designed and deployed an internal document automation suite for Licorne consulting-training. Automatically parses DOCX and PPTX presentation files into normalized company templates, calculates commercial Excel quotations, and provides an executive analytics dashboard.",
    thumbnail: {
      src: undefined,
      alt: "Document Automation Pipeline Schematic",
      type: "image",
      fallbackVariant: "terminal",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Laravel 12", category: "backend", highlight: true },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "AJAX", category: "frontend" },
      { name: "MySQL", category: "database", highlight: true },
      { name: "PHP", category: "backend" },
      { name: "Office Automation", category: "tools" },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "An enterprise document automation and financial quotation engine engineered for Licorne consulting-training to standardize business documentation and monitor reporting metrics.",
      problem:
        "Consulting teams spent hundreds of manual hours converting raw presentation files and drafting customized client quotations across disparate spreadsheet formats.",
      solution:
        "Constructed a high-throughput parser in Laravel 12 that ingests raw documents, maps content to standardized branded templates, generates automated Excel price quotes, and records metrics to an analytics dashboard.",
      role: "Full-Stack Web Developer — Document parser architecture, AJAX dashboard, quotation calculations.",
      duration: "5 Months (Mar 2025 – Aug 2025)",
      architectureHighlights: [
        "Headless file transformation service for DOCX/PPTX to standardized templates",
        "Dynamic quotation algorithm with multi-tier pricing and tax calculations",
        "Asynchronous AJAX analytics dashboard with live KPI charts",
      ],
      keyFeatures: [
        "Automated DOCX/PPTX Template Synthesis",
        "One-click Excel Quotation & Invoice Generation",
        "Live Executive Operational Dashboard",
        "Activity Audit Log & Revision Tracking",
      ],
      results:
        "Accelerated commercial quotation preparation time from hours to seconds and guaranteed 100% brand consistency across client-facing reports.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 02",
      client: "Licorne consulting-training",
      year: "2025",
      featured: true,
      order: 2,
    },
  },
  {
    id: "proj-03",
    slug: "expiration-date-management-system",
    title: "Expiration Date & Recall Tracking System",
    shortTitle: "Expiration Tracker",
    category: "system",
    status: "completed",
    shortDescription:
      "Automated logistics inventory platform for monitoring perishable product lifecycles, batch recalls, and automated notification alerts.",
    fullDescription:
      "A supply-chain management application engineered with Laravel 10, MySQL, and automated CRON scheduling. Tracks product batches, flags near-expiry inventory, automates batch recalls, and notifies warehouse supervisors.",
    thumbnail: {
      src: undefined,
      alt: "Expiration Date System Wireframe Interface",
      type: "image",
      fallbackVariant: "grid",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Laravel 10", category: "backend", highlight: true },
      { name: "Bootstrap", category: "frontend" },
      { name: "jQuery", category: "frontend" },
      { name: "AJAX", category: "frontend" },
      { name: "MySQL", category: "database", highlight: true },
      { name: "CRON Jobs", category: "devops" },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "Supply-chain inventory oversight system designed to prevent commercial losses and regulatory non-compliance from expired inventory.",
      problem:
        "Retailers and warehouses suffer severe financial loss and safety hazards when perishable inventory expiry dates are tracked on fragmented spreadsheets.",
      solution:
        "Engineered an automated batch-tracking system with scheduled CRON background workers that analyze warehouse inventory daily, sending automated alert digests and initiating recall procedures.",
      role: "Full-Stack Developer — Backend algorithms, database design, automated notification pipelines.",
      duration: "2 Months",
      architectureHighlights: [
        "Automated CRON worker processing daily stock expiration indices",
        "Optimized relational query indices for high-volume inventory scans",
        "Multi-channel alert dispatch (email notifications & system alerts)",
      ],
      keyFeatures: [
        "Real-time Expiration Horizon Dashboard",
        "Automated Product Batch Recall Protocol",
        "Barcode / Batch Number Rapid Search Engine",
        "Loss Prevention Analytics & Waste Reports",
      ],
      results:
        "Eliminated manual inventory audits and reduced product expiration losses by over 40% in pilot warehouse deployments.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 03",
      year: "2024",
      featured: true,
      order: 3,
    },
  },
  {
    id: "proj-04",
    slug: "congress-management-platform",
    title: "Congress & Event Management Platform",
    shortTitle: "Congress Event OS",
    category: "fullstack",
    status: "completed",
    shortDescription:
      "Large-scale symposium platform with attendee registration, badge synthesis, QR code entry check-in, and attendance analytics.",
    fullDescription:
      "A comprehensive event orchestration platform developed in Laravel 10 and MySQL. Handles multi-track congress scheduling, participant registrations, automatic PDF badge generation with encrypted QR codes, and real-time on-site check-in verification.",
    thumbnail: {
      src: undefined,
      alt: "Congress Event Architecture",
      type: "image",
      fallbackVariant: "wireframe",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Laravel 10", category: "backend", highlight: true },
      { name: "Bootstrap", category: "frontend" },
      { name: "jQuery", category: "frontend" },
      { name: "AJAX", category: "frontend" },
      { name: "MySQL", category: "database", highlight: true },
      { name: "QR Code Engine", category: "tools" },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "End-to-end event and congress management platform handling online participant registration, badge issuing, and live door check-ins.",
      problem:
        "Organizing academic and corporate congresses involves registration queues, manual check-in lists, and fragmented workshop attendance tracking.",
      solution:
        "Created an integrated registration and admission platform with automated PDF badge generation, encrypted QR codes, and rapid camera-based check-in verification.",
      role: "Full-Stack Developer — QR badge generation pipeline, real-time validation endpoints, database architecture.",
      duration: "3 Months",
      architectureHighlights: [
        "Encrypted QR code hashing for rapid, tamper-proof attendee verification",
        "PDF rendering worker for automated badge generation with dynamic attendee data",
        "High-concurrency attendance logger with sub-100ms response time",
      ],
      keyFeatures: [
        "Self-service Attendee Registration & Workshop Selection",
        "Dynamic PDF Badge & Invitation Dispatch",
        "Mobile-ready QR Code Scanner & Check-in Desk",
        "Live Attendance Heatmaps & Post-event Reporting",
      ],
      results:
        "Processed over 1,000+ attendee registrations seamlessly with zero check-in queue delays.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 04",
      year: "2024",
      featured: true,
      order: 4,
    },
  },
  {
    id: "proj-05",
    slug: "maroc-pub-rental-platform",
    title: "MAROC-PUB Commercial Rental Platform",
    shortTitle: "MAROC-PUB Platform",
    category: "frontend",
    status: "completed",
    shortDescription:
      "Modern, responsive commercial listing and rental front-end built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.",
    fullDescription:
      "A fast, accessible, and type-safe front-end interface engineered for a commercial advertising and rental platform. Features dynamic filtering, interactive map coordinates, fluid micro-interactions, and optimized Core Web Vitals.",
    thumbnail: {
      src: undefined,
      alt: "MAROC-PUB Interface Wireframe",
      type: "image",
      fallbackVariant: "schematic",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Next.js", category: "frontend", highlight: true },
      { name: "TypeScript", category: "frontend", highlight: true },
      { name: "Tailwind CSS", category: "frontend", highlight: true },
      { name: "shadcn/ui", category: "frontend" },
      { name: "REST APIs", category: "backend" },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "Front-end engineering for a prominent Moroccan commercial rental and billboard reservation platform.",
      problem:
        "The legacy web interface was slow, difficult to navigate on mobile devices, and lacked structured catalog filtering for prospective advertisers.",
      solution:
        "Re-architected the client layer using Next.js App Router and TypeScript with shadcn/ui components, delivering lightning-fast listing exploration and smooth reservation flows.",
      role: "Front-end Developer — UI architecture, component system, TypeScript models, API integration.",
      duration: "4 Months (Feb 2024 – Jun 2024)",
      architectureHighlights: [
        "Component-driven design system using Radix UI primitives and Tailwind CSS",
        "Optimized client-side search and facet filtering across hundreds of listings",
        "Strict TypeScript typing across all API contracts and component props",
      ],
      keyFeatures: [
        "Faceted Rental Catalog Search & Geographic Filter",
        "Interactive Space Availability Inspection",
        "Mobile-first Responsive Rental Booking Funnel",
        "Sub-second Route Transitions & Optimized Media Loading",
      ],
      results:
        "Achieved 98+ Lighthouse performance score and increased mobile reservation conversions by 35%.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 05",
      client: "MAROC-PUB",
      year: "2024",
      featured: true,
      order: 5,
    },
  },
  {
    id: "proj-06",
    slug: "sews-maroc-recruitment-system",
    title: "Recruitment Examination & Assessment System",
    shortTitle: "Recruitment Exam OS",
    category: "system",
    status: "completed",
    shortDescription:
      "Secure online examination platform with role-based access control, timed assessments, and automated scoring workflows.",
    fullDescription:
      "Engineered for SEWS-MAROC to digitize and secure the technical evaluation of prospective candidates. Features timed randomized examination questionnaires, automated scoring engines, anti-cheating timers, and HR candidate rankings.",
    thumbnail: {
      src: undefined,
      alt: "SEWS Examination Platform Wireframe",
      type: "image",
      fallbackVariant: "terminal",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Laravel 9", category: "backend", highlight: true },
      { name: "Bootstrap", category: "frontend" },
      { name: "jQuery", category: "frontend" },
      { name: "MySQL", category: "database", highlight: true },
      { name: "RBAC Security", category: "architecture" },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "A secure testing and technical screening platform built for SEWS-MAROC to manage candidate assessment sessions.",
      problem:
        "Conducting paper-based technical exams for hundreds of job applicants caused grading delays, integrity risks, and manual evaluation errors.",
      solution:
        "Developed a secure, role-restricted web platform with randomized question banks, timed test sessions, real-time submission locks, and automated candidate scorecards.",
      role: "Full-Stack Developer — Exam security logic, randomized test engine, database structure.",
      duration: "2 Months (Apr 2023 – May 2023)",
      architectureHighlights: [
        "Strict session integrity and server-side timer validation to prevent tampering",
        "Role-based Access Control (Candidate, Evaluator, HR Admin)",
        "Automated grading engine with instant scorecard calculation",
      ],
      keyFeatures: [
        "Randomized Technical Question Pools",
        "Server-enforced Countdown Timers",
        "Instant Candidate Performance Scorecards",
        "HR Analytics & Exportable Shortlists",
      ],
      results:
        "Transformed candidate screening turnaround time from 3 days to instantaneous real-time reporting.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 06",
      client: "SEWS-MAROC",
      year: "2023",
      featured: false,
      order: 6,
    },
  },
  {
    id: "proj-07",
    slug: "erp-business-management-system",
    title: "ERP Business Management & CRM Suite",
    shortTitle: "ERP Business Suite",
    category: "enterprise",
    status: "completed",
    shortDescription:
      "Enterprise resource planning platform combining CRM, inventory control, sales, purchasing, and workflow automation.",
    fullDescription:
      "A full-featured ERP application engineered with Laravel 10, MySQL, and AJAX. Integrates customer relationship management, stock level tracking, supplier purchase orders, client invoicing, payment status monitoring, and audit trails.",
    thumbnail: {
      src: undefined,
      alt: "ERP Suite Wireframe System",
      type: "image",
      fallbackVariant: "grid",
      aspectRatio: "16/9",
    },
    technologies: [
      { name: "Laravel 10", category: "backend", highlight: true },
      { name: "Bootstrap", category: "frontend" },
      { name: "jQuery", category: "frontend" },
      { name: "AJAX", category: "frontend" },
      { name: "MySQL", category: "database", highlight: true },
    ],
    links: {
      github: "https://github.com/Zackweb56",
    },
    caseStudy: {
      overview:
        "Comprehensive modular ERP platform managing complete enterprise operational lifecycles from customer leads to invoice settlement.",
      problem:
        "Small to medium businesses struggle with disconnected tools for inventory, customer communications, and accounts receivable.",
      solution:
        "Built a unified ERP system in Laravel and MySQL that coordinates stock movements with client purchase orders and real-time financial tracking.",
      role: "Lead Developer — Full architecture, relational data modeling, financial calculation modules.",
      duration: "4 Months",
      architectureHighlights: [
        "Normalized 25+ table relational database schema with ACID transaction safety",
        "AJAX-powered asynchronous inventory lookup and invoice item calculation",
        "Granular permission matrix for sales, warehouse, and accounting personnel",
      ],
      keyFeatures: [
        "Integrated CRM Lead & Customer History Tracking",
        "Real-time Inventory Valuation & Low-stock Alerts",
        "Automated Invoicing & Payment Reconciliation",
        "Executive Profit & Loss Financial Reports",
      ],
      results:
        "Streamlined end-to-end sales and fulfillment workflows with 100% data consistency.",
    },
    metadata: {
      evidenceId: "EVIDENCE // 07",
      year: "2024",
      featured: false,
      order: 7,
    },
  },
];
