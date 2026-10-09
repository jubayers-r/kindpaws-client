# Application Architecture

## Purpose

Describe the actual architecture of KindPaws Client. Update this document when a meaningful architectural decision changes.

## Technology

- Runtime and package manager: Bun (bun@1.3.9)
- Framework: Next.js 16.4.0 (App Router, Turbopack, cacheComponents, partialPrefetching)
- Language: TypeScript 5
- UI: shadcn/ui (Radix UI primitives), Tailwind CSS v4, Motion (framer-motion), Lucide React
- State and Data Fetching: TanStack Query v5 (@tanstack/react-query), Axios
- Authentication: Firebase Authentication v13 (JWT token synchronization with backend)
- Forms and Validation: React Hook Form + Zod (@hookform/resolvers/zod)
- Payments: Stripe (@stripe/stripe-js, @stripe/react-stripe-js)
- Media: ImgBB API for direct image uploads

## Application Structure

The repository follows a clean Next.js App Router structure without a `src/` prefix:

- `app/`: Next.js 16 App Router route segments, layouts, and route boundaries.
  - `(auth)/`: Authentication route group (`/login`, `/register`).
  - `(main)/`: Public customer-facing routes (`/`, `/pets`, `/campaigns`, `/campaigns/[id]`).
  - `dashboard/`: Protected administrative and user dashboard routes (`/dashboard`, `/dashboard/my-pets`, `/dashboard/my-donations`, `/dashboard/users`, etc.).
  - `api/`: Route handlers (e.g. rewrite proxy endpoints where applicable).
- `components/`: UI components organized by domain and responsibility.
  - `components/ui/`: Atomic shadcn/ui components (Button, Dialog, Dropdown, Table, Input, etc.).
  - `components/shared/`: Cross-route components (Navbar, Footer, Logo, PetForm, CreateCampaignForm, etc.).
  - `components/layout/`: Shell and layout orchestrators (e.g. `MainShell`, `DashboardLayout`).
  - `components/homePage/`, `components/petListing/`, `components/campaignPage/`, `components/dashboard/`: Feature-specific modules.
- `context/`: Application-wide React Context providers:
  - `AuthProvider.tsx`: Firebase auth state management and JWT token sync.
  - `AuthRoleProvider.tsx`: TanStack Query-backed role resolution (`useAuthRole`).
- `hooks/`: Custom React hooks (`useAuth`, `useUserRole`, `useAuthRole`, `useAxiosSecure`).
- `lib/`: Utilities and API configuration:
  - `lib/api.ts`: API base URL resolution (`/api` proxy or direct backend fallback).
  - `lib/axiosSecure.ts`: Axios instance configured with JWT request interceptor and 401/403 response handlers.
  - `lib/utils.ts`: Standard `cn()` class merging utility.
- `types/`: Shared TypeScript domain models (`Pet`, `Campaign`, `AppUser`, `UserRole`, etc.).
- `public/`: Static brand assets, category illustrations, hero slides, and placeholders.

## Rendering Boundaries

- Route-level pages and layouts default to Server Components where applicable.
- Client boundaries (`'use client'`) are placed strictly at the smallest practical interactive boundary (forms, modal controllers, data-grid tables, auth listeners).
- Route segments leverage Next.js native `loading.tsx`, `error.tsx`, and `not-found.tsx` for streaming and error handling.
- Dashboard layouts retain instant navigation capabilities without blocking unrendered segment validation.

## Data Flow

1. **User Interaction & Client Mutation:** User triggers action in UI (forms built with React Hook Form, search/filter inputs).
2. **Input Validation:** Client-side validation prevents invalid submissions before triggering network requests.
3. **API Client & Authorization:** Network calls are routed through `useAxiosSecure` (or configured Axios instance) attaching Firebase JWT bearer tokens.
4. **Proxy & Backend:** Requests pass through Next.js rewrites (`/api/:path*` -> Express Backend) or direct backend URL, avoiding CORS issues.
5. **Server State Sync:** TanStack Query handles caching, deduplication, invalidation, and UI optimistic updates.

## API Contracts

- Backend: Node.js / Express REST API running on `KINDPWS_SERVER_URL` (or proxy rewrite `/api/*`).
- Authentication: Firebase ID Token passed as `Bearer <token>` in the `Authorization` header.
- Roles: Backend verifies user role (`admin` vs `user`) via `/api/users/role/:email`.
- Domain Models: Authoritative TypeScript types defined in `types/`.

## State Management

- **Server Cache & Async Data:** TanStack Query v5 (`@tanstack/react-query`) for all remote data fetching, pagination, and mutations.
- **Global Auth State:** React Context (`AuthContext`, `AuthRoleContext`).
- **URL & Search State:** Query parameters (`useSearchParams`, `useRouter`) for shareable filter, sort, and pagination state.
- **Local Component State:** `useState` / `useReducer` for UI ephemeral state (modals, dropdown open states).

## Architectural Invariants

- Server and client boundaries must remain clean: no sensitive tokens or private backend secrets exposed to client modules.
- Client modules import only browser-safe utilities and public environment variables prefixed with `NEXT_PUBLIC_`.
- Authorization must be validated on the backend API; client-side route guards are for UX only.
- UI components strictly conform to the established Tailwind design tokens and shadcn/ui components.

## Related Documentation

- Frontend: `docs/engineering/frontend.md`
- Testing: `docs/engineering/testing.md`
- Security: `docs/engineering/security.md`
- Engineering Index: `docs/engineering/index.md`
