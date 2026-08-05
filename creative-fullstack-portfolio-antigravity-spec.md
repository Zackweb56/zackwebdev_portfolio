# Creative Full-Stack Portfolio — Master Specification & Antigravity Prompt

## 0. Purpose

This document is the **single source of truth** for building my personal Full Stack Developer portfolio.

I want to build a portfolio that is not a normal developer portfolio with:

- Navbar
- Hero
- About
- Skills
- Projects
- Contact
- Generic cards
- Generic fade-in animations

Instead, I want a **creative, cinematic, interactive portfolio experience** inspired by the visual language of the reference screenshots I provided.

The reference screenshots are inspiration for:

- UI density
- surveillance / investigation / classified-system feeling
- typography
- technical labels
- grid systems
- scanlines/noise
- editorial layouts
- project gallery behavior
- micro-interactions
- immersive storytelling

**Do NOT copy the original website.**
Create an original identity around my own profile, content, colors, projects and personality.

---

# 1. Core Concept

## Creative Direction

The portfolio should feel like:

> **A classified digital interface / developer operating system / investigation terminal where the visitor explores my professional profile, evidence/projects and contact information.**

The visitor should feel that they are **interacting with a system**, not simply scrolling through a CV website.

The experience should be:

- Minimal
- Dark
- Technical
- Cinematic
- Editorial
- Experimental
- Professional
- Premium
- Fast
- Accessible
- Responsive

The design must remain usable and readable.

Creativity must never destroy usability.

---

# 2. Color System

ONLY use these primary visual colors:

```text
Background:
#050505

Accent:
#FFAA00
```

The design should be essentially monochrome + amber.

### Allowed supporting values

Use opacity/alpha variations of the same colors where necessary:

```text
#050505
#050505 with opacity

#FFAA00
#FFAA00 with opacity
```

White/gray text should preferably be produced using opacity rather than introducing many additional colors.

For example:

```css
text-white/90
text-white/70
text-white/50
text-white/30

text-[#FFAA00]
text-[#FFAA00]/80
text-[#FFAA00]/50
```

Do NOT introduce:

- Blue
- Purple
- Green
- Red
- Pink
- Gradient-heavy color palettes

The amber color is the only visual accent.

---

# 3. Global Visual Language

The entire website must have a consistent visual language.

## Background

The entire body/background should feel like a dark technical surface.

Use:

- subtle noise/grain
- very subtle scanlines
- extremely subtle grid/technical texture where appropriate
- thin borders
- small technical labels
- tiny metadata
- coordinates/status indicators
- occasional blinking indicators

Important:

### Noise must exist globally.

Do NOT create noise only inside one section.

It should be attached to the global page/background layer.

Example concept:

```text
BODY
 ├── global dark background
 ├── global noise layer
 ├── optional scanline layer
 ├── global cursor/flashlight layer
 └── application content
```

The noise must be subtle enough that it does not reduce text readability.

---

# 4. Typography

Use a strong editorial + technical combination.

Suggested direction:

### Display font

A sophisticated serif or editorial display font for:

- hero name
- major section titles
- large project titles

### UI / technical font

A clean sans-serif or mono font for:

- labels
- metadata
- buttons
- navigation
- technical information
- project categories
- status indicators

Potential font direction:

```text
Display:
Cormorant Garamond / DM Serif Display / Instrument Serif

UI:
Inter / Geist

Technical:
JetBrains Mono / IBM Plex Mono
```

Do not use all of them unnecessarily.

Choose a coherent final combination.

Typography must feel intentional and editorial.

---

# 5. Layout Philosophy

Do NOT build the website as a traditional:

```text
Navbar
Hero
About
Skills
Projects
Contact
Footer
```

Instead, build it as a **single immersive system** with fixed and floating interface elements.

The visitor should always understand:

- where they are
- what section they are viewing
- what they can interact with
- how to navigate

But navigation should remain visually integrated into the concept.

---

# 6. Main Sections

There should be ONLY these primary content sections:

```text
01 — HERO
02 — PROFILE / ABOUT
03 — PROJECTS / EVIDENCE
04 — CONTACT
```

Do not create a separate giant Skills section.

Skills can be integrated into:

- Profile
- Project metadata
- Floating technical UI
- Small skill matrix

Do not create a separate giant Education section.

Education can be integrated into the Profile.

---

# 7. Navigation

The navigation should be minimal and fixed.

Possible concept:

```text
┌──────────────────────┐
│ Z. / SYSTEM          │
│                      │
│ 01 / PROFILE         │
│ 02 / PROJECTS        │
│ 03 / CONTACT         │
└──────────────────────┘
```

Or a vertical side navigation.

It should feel like part of the interface rather than a normal website navbar.

### Requirements

- Fixed position
- Very small footprint
- Keyboard accessible
- Mobile-friendly
- Active section indicator
- Smooth navigation
- GSAP-powered transitions where appropriate

---

# 8. HERO — "SYSTEM INITIALIZATION"

The Hero is the first impression.

It should NOT immediately show everything.

The experience should begin with a short intro/loader.

## Intro Loader

Possible sequence:

```text
INITIALIZING SYSTEM...
LOADING PROFILE...
LOADING PROJECT DATA...
ESTABLISHING CONNECTION...
SYSTEM READY
```

Then transition into the Hero.

The loader should be:

- Short
- Cinematic
- Skippable / intelligently bypassed for returning visitors if appropriate
- Respect `prefers-reduced-motion`

Do not create a 10-second loading animation.

Target approximately:

```text
1.5–3 seconds
```

depending on actual page readiness.

---

# 9. Hero Concept

The Hero should introduce me as a developer.

Example structure:

```text
CLASSIFIED // PROFILE 2026

ZAKARIYAE
BOUGHABA

FULL STACK
WEB DEVELOPER

BACKEND RIGOR.
FRONTEND INTERACTIVITY.
```

But use my actual final content from the CMS.

The hero should contain:

- Name
- Role
- Short positioning statement
- Small technical metadata
- Location
- Availability
- Current focus
- CTA to projects/contact

Avoid huge paragraphs.

---

# 10. HERO ANIMATIONS

Use GSAP carefully.

Recommended animation sequence:

### Phase 1

System initialization.

### Phase 2

Technical metadata appears.

### Phase 3

Name reveals using:

- clip-path
- character/word reveal
- vertical movement
- subtle opacity

### Phase 4

Subtitle appears.

### Phase 5

Technical decorative elements activate.

### Phase 6

Cursor interaction becomes active.

The animation should feel like the system is becoming operational.

---

# 11. CUSTOM CURSOR / FLASHLIGHT

This is one of the most important creative features.

The idea:

> The website is extremely dark, and the user's cursor behaves like a small flashlight / camera light that reveals the interface.

Example:

```text
             dark screen

                  ●
             cursor/light

        content becomes visible
        around the cursor
```

## Implementation direction

Use a fixed full-screen overlay.

The overlay should be mostly opaque/dark.

Around the cursor, create a radial mask/falloff.

Possible technologies:

- GSAP
- CSS radial-gradient
- CSS mask
- pointer events
- requestAnimationFrame if necessary

The light should follow the cursor smoothly.

Do NOT directly snap to mouse position.

Use interpolation / GSAP quickTo / lerp.

Example feeling:

```text
Mouse moves
     ↓
Light follows with slight inertia
     ↓
Content becomes visible
```

The effect must remain subtle.

---

# 12. Flashlight Behavior

The flashlight should not make the entire website unreadable.

Use it as an enhancement.

Possible behavior:

### Default

Dark page with readable primary content.

### Cursor proximity

Nearby decorative elements become brighter.

### Hover

Interactive elements receive a stronger amber highlight.

### Special areas

The flashlight can reveal hidden technical details/noise.

Possible microcopy:

```text
SIGNAL: ACTIVE
SCAN: 87%
SYSTEM: STABLE
```

These are decorative and must not distract from real content.

---

# 13. Mobile Cursor Behavior

Desktop cursor effects should NOT simply be copied to mobile.

There is no traditional mouse on most mobile devices.

On mobile:

- remove custom cursor
- remove flashlight-following cursor
- preserve atmospheric lighting
- preserve noise
- preserve animations
- simplify effects

Performance and usability are more important than forcing desktop effects onto mobile.

---

# 14. ABOUT / PROFILE

The Profile section should feel like a **digital dossier**.

Not a normal "About Me" card.

Possible structure:

```text
PROFILE // PERSONAL FILE

[PHOTO / VISUAL]

NAME
ROLE
LOCATION
EXPERIENCE

SHORT PROFESSIONAL DESCRIPTION

TECH STACK

EDUCATION

LANGUAGES

CURRENT STATUS
```

Use editorial layout rather than cards everywhere.

---

# 15. Profile Photo

If a profile image is used:

- monochrome treatment
- subtle amber overlay
- technical frame
- scanline/noise treatment
- metadata around image

Example:

```text
PROFILE_IMAGE
STATUS: VERIFIED
SIGNAL: STABLE
```

Do not make it look like an AI-generated character.

---

# 16. Profile Content

The CMS should control:

- Name
- Role
- Biography
- Location
- Availability
- Profile image
- Skills
- Languages
- Education
- Experience
- Social links
- Resume/CV link

The frontend must NOT hardcode these values.

---

# 17. PROJECTS — "EVIDENCE BOARD"

Projects should be one of the strongest sections.

Do not create a normal 3-column project grid.

Create an **Evidence Board / Project Archive**.

Possible visual:

```text
PROJECT ARCHIVE

←      PROJECT 03      →

┌───────────────────────────────┐
│                               │
│        PROJECT IMAGE          │
│                               │
│                               │
└───────────────────────────────┘

EVIDENCE // 03

PROJECT NAME

Short description

Laravel / React / MongoDB

VIEW CASE
```

---

# 18. Project Gallery

The project gallery should be interactive.

Possible implementation:

### Horizontal project gallery

The user scrolls vertically, but the project gallery moves horizontally.

GSAP:

```text
Vertical Scroll
      ↓
ScrollTrigger
      ↓
Horizontal project movement
```

This creates a cinematic project archive.

However:

- Must remain accessible
- Must work on touch devices
- Must not trap scrolling
- Must have keyboard controls
- Must have reduced-motion fallback

---

# 19. Project Cards

Cards should NOT be overly rounded.

Use:

```text
sharp corners
thin borders
editorial spacing
technical labels
```

Avoid:

```text
huge rounded cards
glassmorphism everywhere
generic gradient cards
```

Each project can contain:

```text
EVIDENCE #01

PROJECT TITLE

CATEGORY

YEAR

STACK

SHORT DESCRIPTION

LIVE
GITHUB
CASE STUDY
```

---

# 20. Project Interactions

Recommended GSAP interactions:

### Hover

- image scale
- slight image translation
- title reveal
- amber border activation
- metadata movement

### Cursor proximity

- project image reacts slightly
- technical metadata appears

### Open project

Use a smooth transition.

Possible sequence:

```text
Click Project
     ↓
Project image expands
     ↓
metadata moves
     ↓
case-study view opens
```

---

# 21. Project Case Study

Each project should have a dedicated route:

```text
/projects/[slug]
```

The case study can contain:

```text
PROJECT TITLE

OVERVIEW

PROBLEM

SOLUTION

FEATURES

TECHNOLOGIES

ARCHITECTURE

SCREENSHOTS

RESULTS

LINKS
```

This route is still part of the Projects system.

It should not become a completely different website.

---

# 22. CONTACT

Contact should feel like opening a communication channel.

Example:

```text
ESTABLISH CONNECTION

NAME
EMAIL
MESSAGE

[ TRANSMIT MESSAGE ]

STATUS:
CHANNEL READY
```

Do not make the form visually generic.

Possible animation:

```text
FORM SUBMIT
     ↓
VALIDATING
     ↓
ENCRYPTING
     ↓
TRANSMITTING
     ↓
MESSAGE RECEIVED
```

These states are visual feedback only.

---

# 23. Contact Backend

The contact form should be server-side validated.

Requirements:

- Zod validation
- Rate limiting
- Spam protection
- Input sanitization
- Proper error handling
- No sensitive information exposed
- Email notification if an email provider is configured
- Store contact submissions only if necessary

Do not blindly trust client-side validation.

---

# 24. GSAP Animation Architecture

GSAP should be treated as an actual animation system, not random animation code scattered throughout components.

Create an organized animation architecture.

Possible:

```text
frontend/
  animations/
    config.ts
    eases.ts
    hero/
    profile/
    projects/
    contact/
    global/
    cursor/
    transitions/
```

Each animation should have a clear responsibility.

---

# 25. GSAP Features To Use

Use these selectively.

## Core

- gsap.to()
- gsap.from()
- gsap.fromTo()
- gsap.timeline()
- gsap.set()

## Scroll

- ScrollTrigger

## Useful advanced tools

- gsap.context()
- gsap.matchMedia()
- gsap.quickTo()

If needed:

- Flip
- Observer

Do not install/use every GSAP plugin just because it exists.

---

# 26. Recommended Animation Set

The portfolio should include approximately:

### Global

1. Intro loader
2. Page entrance
3. Global cursor/light
4. Navigation active indicator
5. Smooth section transitions
6. Noise atmosphere

### Hero

7. Name reveal
8. Subtitle reveal
9. Metadata reveal
10. Floating technical elements

### Profile

11. Image reveal
12. Text reveal
13. Skills stagger
14. Timeline/education reveal

### Projects

15. Horizontal scroll
16. Project image parallax
17. Project hover
18. Project title reveal
19. Project transition
20. Case-study entrance

### Contact

21. Form reveal
22. Input focus animation
23. Submit status animation

That is enough.

Do NOT turn every element into an animation.

---

# 27. Smooth Scrolling

Evaluate using:

- native smooth scrolling
- Lenis
- GSAP ScrollSmoother if appropriate

Do not automatically add multiple scrolling systems.

If Lenis is used, integrate it properly with ScrollTrigger.

The final experience must feel smooth but not floaty or laggy.

---

# 28. Performance Rules

This portfolio is meant to demonstrate professional frontend engineering.

Therefore:

- Do not overuse blur
- Do not render giant canvas effects unnecessarily
- Do not animate expensive properties continuously
- Prefer transform/opacity
- Avoid layout thrashing
- Lazy-load project images
- Optimize Cloudinary images
- Use responsive image sizes
- Clean up GSAP contexts
- Kill ScrollTriggers when necessary
- Respect reduced motion
- Avoid unnecessary React re-renders

Target:

```text
Fast initial load
Smooth 60fps interactions where possible
Good Core Web Vitals
```

---

# 29. Responsive Design

The design must be intentionally responsive.

Do NOT design desktop first and simply shrink everything.

## Desktop

Full experience:

- flashlight cursor
- complex project gallery
- floating technical UI
- larger typography
- horizontal scrolling

## Tablet

Simplify:

- cursor effects
- spacing
- typography
- project layout

## Mobile

Prioritize:

- readability
- touch
- performance
- navigation
- project browsing

Mobile can use a vertical project list instead of forced horizontal scrolling if necessary.

---

# 30. Accessibility

Must include:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible buttons
- accessible form labels
- alt text
- reduced-motion support
- sufficient contrast
- no content that is only visible through the cursor effect
- no cursor-dependent interaction for critical actions

Creative effects are enhancements, not requirements.

---

# 31. Tech Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
GSAP
ScrollTrigger
```

Potential:

```text
Lenis
Lucide React
Zod
```

Use additional dependencies only when they solve a real problem.

---

# 32. Backend / Data

Use:

```text
MongoDB Atlas
```

Free tier initially.

Use a clean data-access architecture.

Potential collections:

```text
admin_users
profile
projects
contact_messages
site_settings
```

Do not create unnecessary collections.

---

# 33. Cloudinary

Use Cloudinary Free for:

- profile image
- project screenshots
- project galleries
- optional CV/document assets if appropriate

Store Cloudinary public IDs and metadata in MongoDB rather than unnecessarily storing image files inside MongoDB.

Use transformations/responsive delivery.

---

# 34. Authentication

The admin panel is PRIVATE.

Only I should be able to access it.

Security is extremely important.

Do NOT build:

```text
/admin
with no authentication
```

Use a real authentication system.

Requirements:

- secure password hashing
- secure sessions
- HTTP-only cookies
- secure cookie settings in production
- CSRF protection where applicable
- rate limiting
- login attempt protection
- no passwords stored in plaintext
- server-side authorization
- protected admin routes
- logout
- session expiration
- environment variables for secrets
- no admin credentials in frontend code

Prefer an established authentication solution rather than inventing cryptography.

---

# 35. Admin Dashboard

The dashboard should be simple.

Do not spend more effort making the admin dashboard visually experimental than the public portfolio.

It should be clean and practical.

Possible structure:

```text
/admin

Dashboard
Profile
Hero
Projects
Contact Messages
Media
Settings
Logout
```

---

# 36. Admin Content Management

I should be able to edit:

## Hero

- label
- name
- role
- subtitle
- location
- status
- CTA labels/links

## Profile

- biography
- profile photo
- skills
- languages
- education
- experience
- social links

## Projects

- title
- slug
- category
- year
- description
- technologies
- thumbnail
- gallery
- live URL
- GitHub URL
- case study
- featured status
- order
- published status

## Contact

- view messages
- mark read/unread
- archive
- delete

---

# 37. Draft / Published System

Projects should support:

```text
draft
published
```

This allows me to prepare a project before making it public.

---

# 38. Project Ordering

Projects should have an explicit:

```text
order
```

field.

Admin should be able to control project order.

Do not depend only on MongoDB insertion order.

---

# 39. API Architecture

Keep API logic separate from UI.

Conceptually:

```text
Frontend
    ↓
API / Server Actions
    ↓
Validation
    ↓
Authentication / Authorization
    ↓
Service Layer
    ↓
Repository / Data Access
    ↓
MongoDB
```

Do not put large database operations directly inside React components.

---

# 40. Recommended Backend Structure

A possible architecture:

```text
src/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   └── admin/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── hero/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── contact/
│   │   └── cursor/
│   │
│   ├── animations/
│   │   ├── global/
│   │   ├── hero/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── contact/
│   │   └── cursor/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
│
├── backend/
│   ├── auth/
│   ├── db/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── validators/
│   ├── cloudinary/
│   ├── rate-limit/
│   └── utils/
│
└── shared/
    ├── types/
    ├── constants/
    └── schemas/
```

If the chosen Next.js architecture makes a slightly different structure more idiomatic, explain the change before implementing it.

Do not blindly follow a folder tree if Next.js conventions would be violated.

---

# 41. Important Architecture Rule

The portfolio must remain maintainable.

Avoid:

```text
Huge page.tsx
Huge component files
Animation code mixed with database code
Database calls inside presentation components
Hardcoded project data
Hardcoded profile data
Duplicated UI
Random utility files
```

Prefer:

```text
small components
clear responsibilities
services
schemas
types
animation modules
reusable hooks
```

---

# 42. Environment Variables

Never commit secrets.

Example:

```env
MONGODB_URI=
AUTH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

If using another auth/email provider, use appropriate environment variables.

Provide:

```text
.env.example
```

with placeholder values only.

---

# 43. SEO

Even though the site is creative, it must still be a professional portfolio.

Implement:

- metadata
- title
- description
- Open Graph
- Twitter/X card
- canonical URL
- sitemap
- robots
- semantic HTML
- project-specific metadata

The creative UI must not damage SEO.

---

# 44. Content Strategy

The website should communicate within seconds:

```text
Who am I?
What do I do?
What technologies do I use?
What have I built?
How can someone contact me?
```

Creativity should support these answers.

It should never hide them.

---

# 45. Anti-Patterns

Do NOT build:

- generic glassmorphism
- excessive rounded cards
- neon cyberpunk
- excessive gradients
- random 3D objects everywhere
- huge WebGL scene just for decoration
- 20 different animation libraries
- animation on every word
- excessive blur
- slow loading intro
- cursor effects on mobile
- inaccessible hidden text
- fake statistics
- fake client logos
- fake testimonials
- fake experience
- copied design

---

# 46. Optional Creative Enhancements

Evaluate these individually.

## A. System Status

Small global indicator:

```text
● SYSTEM ONLINE
```

## B. Live Coordinates

Decorative:

```text
LAT: ...
LON: ...
```

Do not expose private real-time location.

Use a generic city/location or static values.

## C. Scan Indicator

```text
SCANNING...
```

## D. Signal Indicator

```text
SIGNAL: STRONG
```

## E. Technical Clock

A small clock can exist but should not dominate.

## F. Section Index

```text
01 / 04
02 / 04
03 / 04
04 / 04
```

## G. Project Counter

```text
EVIDENCE 03 / 08
```

All of these must remain subtle.

---

# 47. 3D

3D is NOT required for the first version.

Do not add Three.js / React Three Fiber simply because the portfolio is creative.

First build an excellent 2D experience.

Only consider 3D later if there is a clear concept that improves the portfolio.

The primary stack should remain:

```text
Next.js
TypeScript
Tailwind
GSAP
```

---

# 48. Development Workflow

The project must be built **task by task**.

Do NOT generate the entire application in one giant operation.

The AI agent must:

1. Understand the current architecture.
2. Inspect existing files.
3. Plan the current task.
4. Implement only the current task.
5. Run checks.
6. Report what changed.
7. Wait for approval/next task.

---

# 49. Task Roadmap

## PHASE 0 — Planning

### Task 0.1
Analyze this specification and reference images.

### Task 0.2
Propose the final UX architecture.

### Task 0.3
Propose final typography.

### Task 0.4
Propose component architecture.

### Task 0.5
Propose database schema.

### Task 0.6
Propose authentication architecture.

Do not code yet.

---

# PHASE 1 — Project Foundation

### Task 1.1
Initialize Next.js + TypeScript.

### Task 1.2
Configure Tailwind.

### Task 1.3
Configure fonts.

### Task 1.4
Create folder architecture.

### Task 1.5
Create design tokens.

### Task 1.6
Create global background.

### Task 1.7
Create global noise.

### Task 1.8
Create base responsive layout.

---

# PHASE 2 — Global UI System

### Task 2.1
Build global navigation.

### Task 2.2
Build global status indicators.

### Task 2.3
Build section indicator.

### Task 2.4
Build custom cursor.

### Task 2.5
Build flashlight effect.

### Task 2.6
Add mobile fallback.

### Task 2.7
Add reduced-motion fallback.

---

# PHASE 3 — GSAP FOUNDATION

### Task 3.1
Create GSAP utilities.

### Task 3.2
Create animation context helpers.

### Task 3.3
Create responsive animation helpers using matchMedia.

### Task 3.4
Integrate ScrollTrigger.

### Task 3.5
Integrate smooth scrolling if selected.

### Task 3.6
Create global page transitions.

---

# PHASE 4 — HERO

### Task 4.1
Build Hero UI.

### Task 4.2
Build intro loader.

### Task 4.3
Build Hero reveal timeline.

### Task 4.4
Build metadata animations.

### Task 4.5
Build interactive decorative elements.

### Task 4.6
Optimize mobile Hero.

---

# PHASE 5 — PROFILE

### Task 5.1
Build profile layout.

### Task 5.2
Build profile image system.

### Task 5.3
Build technical metadata.

### Task 5.4
Build skills display.

### Task 5.5
Build education/experience display.

### Task 5.6
Build profile animations.

---

# PHASE 6 — PROJECTS

### Task 6.1
Design project data model.

### Task 6.2
Build project archive.

### Task 6.3
Build project cards.

### Task 6.4
Build horizontal gallery.

### Task 6.5
Add ScrollTrigger interaction.

### Task 6.6
Add project hover effects.

### Task 6.7
Build project detail route.

### Task 6.8
Build case-study transition.

### Task 6.9
Optimize project images.

---

# PHASE 7 — CONTACT

### Task 7.1
Build contact UI.

### Task 7.2
Build form validation.

### Task 7.3
Build server-side submission.

### Task 7.4
Add rate limiting.

### Task 7.5
Build transmission animation.

### Task 7.6
Build success/error states.

---

# PHASE 8 — DATABASE

### Task 8.1
Configure MongoDB Atlas.

### Task 8.2
Create database connection.

### Task 8.3
Create schemas/models.

### Task 8.4
Create repositories.

### Task 8.5
Create services.

### Task 8.6
Create validation schemas.

---

# PHASE 9 — AUTHENTICATION

### Task 9.1
Select authentication architecture.

### Task 9.2
Implement admin authentication.

### Task 9.3
Protect admin routes.

### Task 9.4
Implement secure session handling.

### Task 9.5
Implement logout.

### Task 9.6
Add rate limiting.

### Task 9.7
Audit authorization.

---

# PHASE 10 — ADMIN DASHBOARD

### Task 10.1
Admin shell.

### Task 10.2
Dashboard overview.

### Task 10.3
Hero editor.

### Task 10.4
Profile editor.

### Task 10.5
Project CRUD.

### Task 10.6
Project ordering.

### Task 10.7
Draft/published system.

### Task 10.8
Media manager.

### Task 10.9
Contact message manager.

---

# PHASE 11 — CLOUDINARY

### Task 11.1
Configure Cloudinary.

### Task 11.2
Secure upload flow.

### Task 11.3
Profile image upload.

### Task 11.4
Project image upload.

### Task 11.5
Image optimization.

### Task 11.6
Cleanup unused assets.

---

# PHASE 12 — SECURITY

Perform a dedicated security audit.

Check:

- authentication
- authorization
- sessions
- cookies
- CSRF
- rate limiting
- input validation
- file uploads
- Cloudinary security
- MongoDB access
- environment variables
- XSS
- injection
- exposed API routes
- admin route protection
- error leakage

---

# PHASE 13 — PERFORMANCE

Audit:

- Lighthouse
- bundle size
- image sizes
- fonts
- GSAP usage
- ScrollTrigger
- React rendering
- layout shifts
- animation performance
- mobile performance

---

# PHASE 14 — FINAL POLISH

### Task 14.1
Animation timing polish.

### Task 14.2
Typography polish.

### Task 14.3
Spacing polish.

### Task 14.4
Mobile polish.

### Task 14.5
Accessibility audit.

### Task 14.6
SEO audit.

### Task 14.7
Security audit.

### Task 14.8
Production deployment.

---

# 50. Git Workflow

Use meaningful commits.

Example:

```text
feat: initialize portfolio architecture
feat: add global noise system
feat: add custom cursor flashlight
feat: build hero section
feat: add hero GSAP timeline
feat: build project archive
feat: add project case studies
feat: add admin authentication
feat: add project CMS
fix: improve mobile project gallery
perf: optimize project images
```

Avoid commits like:

```text
update
changes
stuff
final
final2
```

---

# 51. Quality Gate For Every Task

Before considering a task complete:

### Code

- TypeScript has no unnecessary `any`
- Components are reusable
- No duplicated logic
- No console errors
- No dead code

### UI

- Desktop checked
- Mobile checked
- Typography checked
- Spacing checked
- Colors follow the design system

### Animation

- Smooth
- No flickering
- No excessive animation
- Reduced-motion supported
- No memory leaks

### Backend

- Validation
- Authorization
- Error handling
- Secure data access

### Performance

- No unnecessary heavy dependency
- Images optimized
- No unnecessary re-renders

---

# 52. How Antigravity Should Work With Me

This is extremely important.

Do NOT attempt to finish the entire portfolio immediately.

Work collaboratively with me.

For each task:

```text
1. Explain the objective.
2. Explain the files that will change.
3. Implement the task.
4. Run relevant checks.
5. Show the result/summary.
6. Mention anything I need to verify.
7. Stop.
```

Then wait for my instruction.

Do not automatically continue to the next major phase.

---

# 53. When There Is A Design Decision

If multiple solutions are possible:

Do NOT randomly choose one.

Explain:

```text
Option A
Pros:
Cons:

Option B
Pros:
Cons:

Recommendation:
```

Then choose the option that best matches the portfolio concept.

For minor implementation details, make the decision yourself.

---

# 54. When Something Is Technically Impossible

Do not fake it.

Explain:

```text
Problem
Why it happens
Possible solutions
Recommended solution
```

Then implement the safest professional approach after approval when the decision materially affects architecture.

---

# 55. Important Rule About AI-Generated Code

The portfolio itself is also a demonstration of my engineering ability.

Therefore:

Do not generate unnecessarily complicated code simply to make it look advanced.

Prefer:

```text
simple
clean
maintainable
performant
well-structured
```

The visual experience can be advanced while the underlying architecture remains clean.

---

# 56. Definition Of Done

The project is complete when:

- [ ] Hero is visually impressive
- [ ] Profile feels like a digital dossier
- [ ] Projects feel like an evidence archive
- [ ] Contact feels like a communication terminal
- [ ] Global noise is present
- [ ] Amber/black visual identity is consistent
- [ ] Cursor flashlight works on desktop
- [ ] Mobile experience is intentionally designed
- [ ] GSAP animations are polished
- [ ] Scroll animations are smooth
- [ ] Reduced motion works
- [ ] Projects come from MongoDB
- [ ] Profile content comes from MongoDB
- [ ] Hero content comes from MongoDB
- [ ] Contact messages are handled securely
- [ ] Admin authentication is secure
- [ ] Admin dashboard works
- [ ] Cloudinary media management works
- [ ] SEO is implemented
- [ ] Accessibility is acceptable
- [ ] Performance is acceptable
- [ ] Security audit is completed
- [ ] Production deployment works

---

# 57. MASTER PROMPT FOR ANTIGRAVITY

Copy the following prompt together with this Markdown specification:

---

## PROMPT

You are my senior full-stack engineer, frontend architect, creative developer and technical collaborator.

I am building a personal Full Stack Developer portfolio based on the attached visual references and the complete specification in this document.

Read the entire specification before doing anything.

The references are **visual inspiration only**. Do not copy another designer's website. Create an original portfolio identity based on the concept described here.

### My target

I want a premium, cinematic, creative developer portfolio built with:

- Next.js
- TypeScript
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- MongoDB Atlas
- Cloudinary

The public website has only four primary content areas:

1. Hero
2. Profile / About
3. Projects / Evidence
4. Contact

The design must be based around:

```text
#050505
#FFAA00
```

The website should feel like a:

> classified digital developer system / investigation interface / evidence archive

It should be dark, editorial, technical and immersive without becoming a generic cyberpunk website.

### Important visual requirements

The entire page needs:

- global noise/grain
- subtle scanlines
- technical metadata
- thin borders
- editorial typography
- amber highlights
- dark background
- minimal UI
- sharp/controlled geometry

The noise must be global, not limited to one section.

### Main creative interaction

I want a custom desktop cursor that behaves like a small flashlight/camera light.

The page remains dark, and the cursor subtly reveals/highlights content around it.

The light should:

- follow the mouse smoothly
- have inertia
- use a soft falloff
- react to interactive elements
- integrate with the amber visual language
- never block clicks
- never be required to understand critical content
- be disabled/simplified on mobile
- respect prefers-reduced-motion

### GSAP

Use GSAP as a structured animation system.

Do not randomly scatter GSAP calls everywhere.

Organize animations by feature:

```text
global
cursor
hero
profile
projects
contact
transitions
```

Use:

- timelines
- ScrollTrigger
- matchMedia
- context cleanup
- quickTo/lerp-style movement where useful

Use GSAP only where it improves the experience.

### Hero

Create an intro/loading sequence that feels like a system initialization.

For example:

```text
INITIALIZING...
LOADING PROFILE...
LOADING PROJECT DATA...
SYSTEM READY
```

Then reveal the hero.

The intro must be short and must support reduced motion.

### Projects

Projects are a major focus.

Do not create a boring grid.

Create an evidence/archive experience.

Desktop can use a GSAP-powered horizontal gallery controlled by vertical scroll.

Projects should have:

- image
- title
- category
- year
- technologies
- description
- links
- case study

Each project should support:

```text
/projects/[slug]
```

### Backend

The portfolio must have a real backend/data layer.

Use MongoDB Atlas.

Content must be editable from an admin dashboard.

The admin should be able to manage:

- Hero
- Profile
- Projects
- Contact messages
- Media/settings as appropriate

Do not hardcode the public portfolio content.

### Authentication

The admin dashboard is private.

Implement secure authentication.

Requirements:

- password hashing
- secure sessions
- HTTP-only cookies
- secure production cookies
- authorization
- rate limiting
- protected admin routes
- secure logout
- environment variables
- no secrets in frontend code

Do not invent insecure authentication.

Prefer established, maintained authentication patterns.

### Cloudinary

Use Cloudinary for profile/project media.

Do not store large image files in MongoDB.

Use optimized/responsive image delivery.

### Architecture

Keep frontend presentation and backend logic clearly separated.

Use clean layers such as:

```text
UI
↓
API / server actions
↓
validation
↓
authorization
↓
services
↓
repositories/data access
↓
MongoDB
```

Do not put database logic inside presentation components.

### Development process

This is the most important instruction:

**DO NOT BUILD THE WHOLE PROJECT AT ONCE.**

Work with me task by task.

First, only analyze the specification.

Then propose:

1. Final UX architecture
2. Final visual system
3. Typography
4. Component architecture
5. GSAP animation architecture
6. MongoDB schema
7. Authentication architecture
8. Admin architecture
9. Development roadmap

Do not start coding until we agree on the architecture.

After that, work phase by phase.

For every task:

1. Explain what we are building.
2. List files that will change.
3. Implement it.
4. Run TypeScript/lint/build checks where appropriate.
5. Check for errors.
6. Explain what was completed.
7. Stop and wait for my next instruction.

Never silently jump to another major task.

### Engineering quality

This is a portfolio intended to demonstrate my professional engineering skills.

Therefore:

- clean TypeScript
- avoid unnecessary `any`
- reusable components
- maintainable architecture
- no duplicated logic
- no unnecessary dependencies
- no fake security
- no hardcoded CMS content
- no giant components
- no giant page files
- no random animation code
- no performance-heavy effects without justification

### Performance

The site must be visually impressive but fast.

Optimize:

- images
- fonts
- animations
- React rendering
- GSAP
- ScrollTrigger
- bundle size
- mobile performance

Avoid unnecessary WebGL/3D.

Do not add Three.js just because the portfolio is creative.

### Accessibility

Creative effects are enhancements.

Critical content must remain usable without:

- mouse
- cursor flashlight
- animation
- hover

Support:

- keyboard navigation
- focus states
- semantic HTML
- reduced motion
- accessible forms
- alt text
- readable contrast

### Responsive behavior

Desktop can have the complete cinematic experience.

Mobile must be intentionally designed.

Do not simply shrink the desktop UI.

On mobile:

- remove custom mouse cursor
- simplify complex effects
- make projects touch-friendly
- preserve visual identity
- prioritize readability and performance

### Final philosophy

The goal is not:

> "Make a website with lots of animations."

The goal is:

> "Create a memorable digital experience that demonstrates that I am a serious Full Stack Developer who understands both engineering and high-quality frontend interaction design."

The interface should feel sophisticated, not chaotic.

Every animation must have a purpose.

Every decorative element must support the concept.

Every technical decision must prioritize maintainability and performance.

Start by analyzing this specification and proposing the architecture and implementation roadmap.

Do not code yet.

---

# END OF MASTER SPECIFICATION
