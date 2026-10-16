# 🐾 KindPaws – Enterprise-Grade Pet Adoption & Crowdfunding Platform

[![Live Platform](https://img.shields.io/badge/Live_Demo-kindpaws.byjubayer.com-FF642F?style=for-the-badge&logo=vercel&logoColor=white)](https://kindpaws.byjubayer.com/)
[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-Strict_Type_Safe-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun_Runtime-High_Performance-FBF0DF?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-Engineered-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AI-Native Governance](https://img.shields.io/badge/AI--Native-AGENTS%20%7C%20Architecture-7C3AED?style=for-the-badge&logo=openai&logoColor=white)](#-ai-native-architecture--engineering-governance)

An enterprise-ready, mission-driven **Next.js 16 (App Router) + TypeScript** platform connecting prospective pet parents with rescue animals, featuring real-time adoption workflows, role-based governance, and Stripe-powered crowdfunding campaigns.

> **Production Deployment:** [https://kindpaws.byjubayer.com/](https://kindpaws.byjubayer.com/)

---

## Executive Summary (For Technical Leadership)

KindPaws was architected to demonstrate how high-performance modern web standards solve real-world operational challenges in animal welfare:

- **Business Value**: Consolidates pet listings, adoption vetting, and financial donations under a unified, accessible, conversion-optimized experience.
- **Modern Performance Stack**: Engineered with Next.js 16 (App Router with Turbopack & Partial Prerendering) paired with the Bun runtime, delivering fast cold-starts, instant client transitions, and optimized Core Web Vitals (LCP/CLS/INP).
- **Security & Multi-Tenancy**: Built with strict role-based access control (RBAC), tokenized JWT synchronization via Axios interceptors, server-side route guards, and zero secret leakage to the client bundle.
- **Enterprise UI/UX**: Crafted with Tailwind CSS v4 tokens, accessible Radix UI / shadcn primitives, Framer Motion micro-interactions, responsive chart visualizations (Recharts), and rich text storytelling (TipTap).

---

## 🎯 Core Capabilities & User Journeys

```
                    ┌──────────────────────────────────────────────┐
                    │            KindPaws Unified Platform         │
                    └──────────────────────┬───────────────────────┘
                                           │
             ┌─────────────────────────────┴─────────────────────────────┐
             ▼                                                           ▼
┌─────────────────────────┐                                 ┌─────────────────────────┐
│     Adopter & Donor     │                                 │     Platform Admin      │
├─────────────────────────┤                                 ├─────────────────────────┤
│ • Advanced Multi-filter │                                 │ • System-Wide Metrics   │
│ • Full Pet Dossiers     │                                 │ • Adoption Lifecycle    │
│ • 1-Click Applications  │                                 │ • Campaign Moderation   │
│ • Secure Stripe Donates │                                 │ • User RBAC Promotion   │
│ • TipTap Rich Stories   │                                 │ • Real-Time Analytics   │
└─────────────────────────┘                                 └─────────────────────────┘
```

### 1. Public Marketplace & Adoption

- **Real-Time Catalog Search & Filter (`/adopt`)**: Instant category and keyword filtering with optimistic state synchronization.
- **Comprehensive Pet Dossiers (`/pet/details/[id]`)**: Detailed health status, temperament, history, owner credentials, and interactive adoption request modals.
- **Transparent Crowdfunding (`/campaigns`)**: Goal-driven fundraising campaigns with visual funding meters, recent donor feeds, and Stripe card processing.
- **Rich Storytelling Editor (`/campaign/details/[id]`)**: TipTap WYSIWYG editor integration for campaigners to document rescue updates with formatted media and progress milestones.

### 2. User Workspace (`/dashboard/*`)

- **Actionable Overview**: Instant snapshot of active adoption requests, submitted pets, and financial contribution summaries.
- **Adoption Request Tracker**: Complete review pipeline for incoming inquiries on user-listed pets with one-click status transitions (`Pending` / `Approved` / `Rejected`).
- **Pet Registration Pipeline**: Dynamic multipart form with real-time Zod schema validation and ImgBB cloud storage integration.
- **Personal Donation Ledger**: Transparent history of financial donations with receipt/invoice references.

### 3. Administrative Control Center

- **Executive Analytics Overview**: Platform-wide metrics, distribution charts (Recharts), and health diagnostics.
- **Inventory & Campaign Moderation**: Comprehensive control across all platform pets and fundraising campaigns with administrative overrides and deletion rights.
- **Identity & RBAC Management**: Complete user directory with instant role promotions (`user` ⇄ `admin`).

---

## ⚙️ Architectural Decisions & Tech Stack

| Domain                   | Technology                      | Engineering Rationale                                                                      |
| :----------------------- | :------------------------------ | :----------------------------------------------------------------------------------------- |
| **Runtime & Toolchain**  | **Bun (`v1.3.9+`)**             | Ultra-fast dependency resolution, package scripting, and native TypeScript execution.      |
| **Framework**            | **Next.js 16.4.0 (App Router)** | Turbopack compilation, Partial Prerendering (PPR), streaming SSR, and layout persistence.  |
| **Language**             | **TypeScript 5 (Strict)**       | Strict compile-time safety across UI schemas, API contracts, and context states.           |
| **Styling Architecture** | **Tailwind CSS v4**             | Next-generation CSS theme engine with `@tailwindcss/turbopack` and zero runtime CSS bloat. |
| **Component Primitives** | **shadcn/ui & Radix UI**        | WAI-ARIA compliant, headless, accessible foundational design system.                       |
| **Server State & Cache** | **TanStack Query v5**           | Declarative remote data caching, stale-while-revalidate, and deduplicated network calls.   |
| **Identity & OAuth**     | **Firebase Auth v13**           | Multi-provider authentication (Google, GitHub, Email) with client-side token refresh.      |
| **Payment Gateway**      | **Stripe SDK**                  | PCI-compliant card payments with embedded Elements and client-side confirmation.           |
| **Form Engineering**     | **React Hook Form + Zod**       | Controlled rendering footprint with type-inferred runtime schema validation.               |
| **Rich Text Engine**     | **TipTap (`@tiptap/react`)**    | Headless extensible text editor producing sanitized, responsive HTML output.               |

---

## 📁 Repository Structure

```text
kindpaws-client/
├── app/                        # Next.js App Router route segments
│   ├── (auth)/                 # Isolated authentication routes (Login / Register)
│   ├── (main)/                 # Public customer-facing pages (Adopt, Campaigns, Contact)
│   ├── dashboard/              # Role-protected User & Admin portals
│   ├── layout.tsx              # Root HTML shell & provider wrappers
│   ├── error.tsx               # Root exception boundary
│   ├── loading.tsx             # Root streaming suspense skeleton
│   └── not-found.tsx           # Global 404 handler
├── components/                 # Component Architecture
│   ├── ui/                     # Atomic shadcn/ui primitives (Button, Dialog, Table, Sheet)
│   ├── shared/                 # Cross-cutting components (Navbar, Footer, Logo, PetForm)
│   ├── layout/                 # MainShell, responsive header, and navigation switchers
│   ├── dashboard/              # Analytics charts, data tables, and modal dialogs
│   ├── homePage/               # Landing page modules (Hero Swiper, Categories, CTA, FAQ)
│   └── campaignPage/           # Campaign displays and Stripe payment modal
├── context/                    # Shared context providers (AuthProvider, AuthRoleProvider)
├── hooks/                      # Custom hooks (useAuth, useUserRole, useAxiosSecure)
├── lib/                        # Infrastructure, Axios interceptors, and utility functions
├── types/                      # Ground-truth TypeScript contracts & models
├── docs/                       # Internal engineering documentation (frontend, security, tests)
├── ARCHITECTURE.md             # Ground-truth architecture blueprint
└── AGENTS.md                   # AI agent governance protocol
```

---

## 🔒 Security & Code Standards

- **Server-Side Authorization**: Hiding UI elements is never treated as security. Sensitive routes and administrative actions validate JWT tokens and authorization roles against backend APIs on every call.
- **Zero Secret Exposure**: Public bundles only ingest `NEXT_PUBLIC_` runtime variables; API secret keys and privileged tokens remain strictly server-isolated.
- **Sanitized Inputs & Outputs**: All rich-text content rendered via TipTap is defensively parsed and sanitized to protect against cross-site scripting (XSS).
- **Resilient Layout Boundaries**: Next.js 16 loading and error boundaries isolate failure domains, ensuring uninterrupted navigation across dashboard segments.

---

## 🚀 Local Development & Setup

### Prerequisites

- **Bun** (recommended: `v1.3+`)
- Node.js `v20+` (optional runtime fallback)

### 1. Clone Repository & Install

```bash
git clone https://github.com/jubayers-r/kindpaws-client.git
cd kindpaws-client
bun install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Third-Party Integrations
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key

# Backend API Endpoint
NEXT_PUBLIC_API_URL=https://kind-paws.vercel.app
```

### 3. Launch Development Server

```bash
bun dev
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Verification Suite

```bash
# Static type checking
bun x tsc --noEmit

# Linting
bun run lint

# Production build
bun run build
```

---

## 🤖 AI-Native Architecture & Engineering Governance

KindPaws is engineered from the ground up as an **AI-Native, Agent-Ready Codebase**. It implements state-of-the-art context grounding and machine-readable engineering protocols to ensure autonomous coding agents and human engineers collaborate under identical, deterministic constraints:

- **[`AGENTS.md`](AGENTS.md) — Autonomous Agent Operating Protocol**:
  Defines strict execution boundaries, source-of-truth invariants, destructive command guardrails, runtime package manager rules (Bun exclusively), and automated verification workflows. Prevents hallucinations and guarantees zero regressive diffs during agentic pairing.
- **[`ARCHITECTURE.md`](ARCHITECTURE.md) — Ground-Truth System Blueprint**:
  Authoritative map of component lifecycles, data contracts, client-server boundaries, and caching strategies. Ensures every feature aligns with the overarching domain design.
- **[`docs/engineering/`](docs/engineering/) — Maintained Standards & Protocols**:
  - [`frontend.md`](docs/engineering/frontend.md): Strict conventions for Tailwind CSS v4, shadcn/ui primitives, accessibility (WAI-ARIA), and component decoupling.
  - [`security.md`](docs/engineering/security.md): Server-side authorization invariants, defense against privilege escalation, and zero-trust token synchronization.
  - [`testing.md`](docs/engineering/testing.md): Automated verification sequences, build validation criteria, and manual regression matrix.

---

## 🛂 Demo Credentials

| Access Level               | Email             | Password | Primary Capabilities                                           |
| :------------------------- | :---------------- | :------- | :------------------------------------------------------------- |
| **Platform Administrator** | `admin@gmail.com` | `123456` | Full platform metrics, moderation, user promotion/demotion     |
| **Standard User**          | `user@gmail.com`  | `123456` | Pet creation, adoption request tracking, fundraising campaigns |

---

## 👨‍💻 Engineer & Architect

**Jubayer Shikder**
_Full-Stack Software Engineer & Next.js Specialist_
Building high-reliability, responsive, and performance-first web applications.

- 💼 **LinkedIn**: [linkedin.com/in/jubayer-shikder](https://linkedin.com/in/jubayer-shikder)
- 💻 **GitHub**: [github.com/jubayers-r](https://github.com/jubayers-r)
- 🐦 **Twitter (X)**: [@jubayers_r](https://x.com/jubayers_r)
- 📧 **Email**: [jubayer.shikder.007@gmail.com](mailto:jubayer.shikder.007@gmail.com)

---

## 📜 License

This software is released under the [MIT License](LICENSE).
