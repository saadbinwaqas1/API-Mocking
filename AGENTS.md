<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dynamic API Mocking Dashboard - Developer Log & Memory

## 🚀 Project Overview
A modern web application allowing developers to create custom API endpoints with fake JSON data, configurable simulated latency (delay), HTTP status codes (200, 404, 500, etc.), and shareable API links.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript, `src/` directory)
- **Styling & UI**: Tailwind CSS v4, Framer Motion (Glassmorphism & Dual Light/Dark Theme Animations)
- **Database & ORM**: Vercel PostgreSQL + Prisma ORM v7 (`@prisma/adapter-pg` driver)
- **Authentication**: NextAuth.js (Credentials Provider + Google OAuth Provider)
- **Icons & UI**: Lucide React, Sonner (Toast notifications)

## 📁 Key File Structure
- `README.md`: Comprehensive open-source documentation with usage examples and Vercel deployment guide.
- `prisma/schema.prisma`: User, Account, Session, VerificationToken, and ApiEndpoint models.
- `prisma.config.ts`: Prisma v7 configuration file.
- `src/lib/prisma.ts`: Prisma Client singleton instance with `PrismaPg` adapter & connection timeout options.
- `src/lib/auth.ts`: NextAuth Options & Providers configuration.
- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth route handler.
- `src/app/api/auth/register/route.ts`: Credentials User Registration API.
- `src/app/api/user/profile/route.ts`: User profile endpoint (Name update, Password change, Account deletion).
- `src/app/api/mock/[slug]/route.ts`: Public catch-all dynamic mock engine with delay simulation, custom HTTP status, and CORS.
- `src/app/api/endpoints/route.ts`: Fetch user endpoints (GET) and create new mock endpoint (POST).
- `src/app/api/endpoints/[id]/route.ts`: Delete mock endpoint (DELETE) and toggle active status / update (PATCH).
- `src/components/Navbar.tsx`: Glassmorphic navigation header with theme toggle, mobile Hamburger menu with slow animated drawer, profile settings trigger, & sign-out actions.
- `src/components/CreateEndpointModal.tsx`: Interactive Modal for creating mock endpoints with fixed `/mock/` padding, mobile scrollability, status picker, latency slider, and pretty JSON editor.
- `src/components/EndpointCard.tsx`: Interactive Cards with one-click copy URL, toggle active state, and live API tester modal.
- `src/components/ProfileModal.tsx`: Account settings modal for editing profile, changing password, and account deletion.
- `src/components/ThemeToggle.tsx`: Sun / Moon theme switcher for Light and Dark modes.
- `src/components/Providers.tsx`: NextAuth SessionProvider & Sonner Toaster wrapper.
- `src/app/login/page.tsx`: Glassmorphic Auth Page (Sign In & Sign Up toggle, Google OAuth, Clean Stationary Button).
- `src/app/dashboard/page.tsx`: Full-featured Interactive Dashboard UI with compact mobile grid, real-time stats, search filter, dual light/dark modes, and account settings.
- `src/app/globals.css`: Tailwind v4 theme configuration with `@variant dark`.
- `.env`: Environment variables (POSTGRES_PRISMA_URL, DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET).

## ✅ Progress & Completed Modules
- [x] **Project Initialization**: Next.js 16 App Router setup with TS & Tailwind v4.
- [x] **Package Installation**: Prisma v7, NextAuth, Bcryptjs, Framer Motion, Lucide React, Sonner, `@prisma/adapter-pg`, `pg`.
- [x] **Phase 1 (Database)**: Prisma Schema created, Prisma v7 setup, `npx prisma db push` verified successfully!
- [x] **Phase 2 (Authentication & Auth UI)**: Credentials & Google OAuth providers + Registration API + Clean Glassmorphic Auth UI.
- [x] **Phase 3 (Dynamic API Engine)**: Public dynamic route `/api/mock/[slug]` + Endpoints CRUD APIs (`/api/endpoints`).
- [x] **Phase 4 (Dashboard UI)**: Glassmorphic dashboard, Endpoint creation form, status/delay sliders, live test modal, stats header.
- [x] **Phase 5 (Enhancements & Vercel Prep)**: Comprehensive README.md created, Vercel readiness audit verified, Google OAuth credentials guide provided!

## 🎉 Status: ALL PHASES, ENHANCEMENTS & DOCS 100% COMPLETE & VERIFIED!
