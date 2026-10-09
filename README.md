# 🐾 KindPaws – Pet Adoption & Donation Platform

A high-performance, modern **Next.js 16 (App Router) + TypeScript** client application where users can discover, adopt, or launch fundraising donation campaigns for pets in need. Engineered natively for Next.js with Bun, Turbopack, Tailwind CSS v4, and shadcn/ui.

## 🌐 Live Platform

🔗 [Visit KindPaws](https://kind-paws.web.app/)

---

## 🎯 Platform Overview

KindPaws bridges compassionate people with pets waiting for a home and provides transparent fundraising campaigns for medical care, rescue operations, and animal welfare:

- **Pet Discovery & Adoption**: Search, filter, and apply for adoption across various pet categories.
- **Fundraising & Campaigns**: Create and support donation campaigns with real-time goal progress.
- **Secure Stripe Donations**: Direct card payment processing and transparent donation tracking.
- **Role-Based Dynamic Dashboard**: Tailored management portals for regular users and administrators.
- **Modern Streaming Architecture**: Native App Router loading, error, and not-found boundaries with instant navigation.

---

## ✨ Features & Capabilities

### 🔐 Authentication & Access Control
- **Firebase Auth v13**: Email/password registration and Google/GitHub OAuth integrations.
- **JWT Authorization**: Automatic token synchronization with backend REST API using configured Axios interceptors.
- **Role-Based Guards**: Protected routes distinguishing regular users and platform administrators.
- **Instant Navigation**: Dashboard layout retains client state and renders continuously without blocking segment validation.

### 🏠 Public User Experience
- **Interactive Homepage**: Dynamic hero carousel, featured categories, reservation booking appointment form, FAQ accordion, testimonials, and brand showcase.
- **Pet Listing (`/adopt`)**: Search by keywords and filter by animal category with responsive grid layouts.
- **Pet Details (`/pet/details/[id]`)**: Full pet profile, temperament, medical details, and interactive adoption request modal.
- **Campaigns (`/campaigns`)**: Donation campaigns discovery with visual progress meters and funding targets.
- **Campaign Details (`/campaign/details/[id]`)**: Rich storytelling via TipTap WYSIWYG, campaign milestones, donor recommendations, and Stripe payment modal.
- **Contact Us (`/contact-us`)**: Integrated contact form and community inquiry cards.

### 🧑 User Dashboard (`/dashboard/*`)
- **Dashboard Overview**: Key metrics, donation history overview, and rapid shortcuts.
- **My Added Pets**: Comprehensive listing of user's submitted pets with quick edit and adoption status toggles.
- **Add / Edit Pet (`/dashboard/add-pet`, `/dashboard/update-pet/[id]`)**: Comprehensive pet registration form with ImgBB direct image upload integration.
- **Adoption Requests (`/dashboard/adoption-requests`)**: Real-time review and processing of incoming adoption requests.
- **My Campaigns (`/dashboard/my-campaigns`)**: Fundraising management, pause/unpause campaigns, edit goals, and view donor tables.
- **My Donations (`/dashboard/my-donations`)**: Track all contributions with invoice references and refund request options.
- **User Profile (`/dashboard/profile`)**: Manage personal details and profile avatar.

### 🛠️ Admin Dashboard
- **Admin Overview**: Platform-wide metrics, pet category breakdown pie charts (Recharts), and system logs.
- **All Pets (`/dashboard/all-pets`)**: Global directory of all pets with administrative deletion and status override capabilities.
- **All Campaigns (`/dashboard/all-donations`)**: Platform-wide overview of all campaigns and donation transactions.
- **Users Management (`/dashboard/users`)**: Directory of registered accounts with privilege management (promote to admin / demote to user).

---

## ⚙️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Package Manager** | **Bun (`bun@1.3.9`)** | Fast package management, scripts, and runtime |
| **Framework** | **Next.js 16.4.0 (App Router)** | Turbopack compilation, Cache Components, Partial Prefetching |
| **Language** | **TypeScript 5** | Strict type safety across UI, context, and data layers |
| **UI & Styling** | **Tailwind CSS v4** | Utility-first styles with `@tailwindcss/turbopack` and CSS theme tokens |
| **Component System** | **shadcn/ui & Radix UI** | Accessible, headless UI primitives and components |
| **Server State & Caching** | **TanStack Query v5** | Remote data caching, deduplication, and optimistic updates |
| **Authentication** | **Firebase Auth v13** | Client authentication SDK and OAuth provider orchestration |
| **Payment Gateway** | **Stripe SDK** | Embedded payment element and client processing |
| **Rich Text Editor** | **TipTap (`@tiptap/react`)** | Clean rich-text authoring for campaign descriptions |
| **Animations** | **Motion (`motion/react`)** | Smooth route transitions, modal appearances, and micro-interactions |
| **Notifications** | **Sonner** | Clean toast notifications for feedback and alerts |
| **Data Visualization** | **Recharts** | Responsive SVG charts for administrative dashboard analytics |

---

## 📁 Repository Structure

```text
kindpaws-client-ts/
├── app/                        # Next.js App Router route segments
│   ├── (auth)/                 # Login and registration routes
│   ├── (main)/                 # Public user-facing pages (adopt, campaigns, etc.)
│   ├── dashboard/              # Protected user and admin dashboard routes
│   ├── error.tsx               # Root error boundary
│   ├── loading.tsx             # Root streaming loading boundary
│   └── not-found.tsx           # Global 404 page
├── components/                 # React component library
│   ├── ui/                     # Atomic shadcn/ui components (Button, Dialog, Table, etc.)
│   ├── shared/                 # Cross-route components (Navbar, Footer, Logo, PetForm, etc.)
│   ├── layout/                 # MainShell and layout orchestrators
│   ├── dashboard/              # Dashboard shells, tables, and metric cards
│   ├── homePage/               # Home-specific sections (Hero, Swiper, FAQ, etc.)
│   ├── petListing/             # Pet catalog filters and card grids
│   └── campaignPage/           # Campaign presentation and donation modal
├── context/                    # React Context providers (AuthProvider, AuthRoleProvider)
├── hooks/                      # Custom hooks (useAuth, useUserRole, useAxiosSecure, etc.)
├── lib/                        # Configuration & utilities (api.ts, axiosSecure.ts, utils.ts)
├── types/                      # Authoritative TypeScript types (Pet, Campaign, User, etc.)
├── public/                     # Static brand assets, categories, and hero slides
├── docs/                       # Engineering standards (frontend, testing, security)
├── ARCHITECTURE.md             # Ground-truth architectural documentation
└── AGENTS.md                   # AI agent runtime protocol and operating rules
```

---

## 🔒 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Third-Party Services
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key

# Backend API Configuration
NEXT_PUBLIC_API_URL=https://kind-paws.vercel.app
```

---

## 🚀 Getting Started

This repository strictly enforces **Bun** as its package manager and runtime.

### 1. Install Dependencies
```bash
bun install
```

### 2. Run Development Server
```bash
bun dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Verification & Checks
```bash
# Typecheck
bun x tsc --noEmit

# Lint check
bun run lint

# Production build
bun run build
```

---

## 🛂 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `123456` |
| **Regular User** | `user@gmail.com` | `123456` |

---

## 📜 Engineering Standards & Guidelines

For architectural principles and engineering protocols, refer to:
- [`ARCHITECTURE.md`](ARCHITECTURE.md): Application architecture, state management, and boundaries.
- [`AGENTS.md`](AGENTS.md): AI agent governance protocol and runtime invariants.
- [`docs/engineering/frontend.md`](docs/engineering/frontend.md): UI, forms, accessibility, and styling standards.
- [`docs/engineering/testing.md`](docs/engineering/testing.md): Verification orders and regression testing checklists.
- [`docs/engineering/security.md`](docs/engineering/security.md): Secrets protection and authorization invariants.

---

## 👨‍💻 Author

**Md. Jubayer Shikder** — Full-Stack Developer  
[🐦 Twitter (X)](https://x.com/jubayers_r) • [📧 Email](mailto:jubayer.shikder.007@gmail.com) • [💼 LinkedIn](https://linkedin.com/in/jubayer-shikder) • [💻 GitHub](https://github.com/jubayers-r)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.
