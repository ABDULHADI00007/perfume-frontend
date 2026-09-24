# Premium Perfume Ecommerce - Frontend Architecture

Modular, scalable, SEO-first Next.js (App Router) frontend foundation for a luxury perfume e-commerce brand.

## Architecture Highlights

- **App Router Routing**: Clean separation of storefront `(store)` and `admin` routes.
- **Domain-Oriented Feature Architecture**: Business logic isolated per feature inside `src/features/`.
- **Shared Components Hierarchy**: Reusable UI primitives, layout wrappers, and domain component shells.
- **API & Data Abstraction Layer**: Standardized HTTP client and API endpoints in `src/lib/api/`.
- **SEO First**: Built-in OpenGraph, Twitter, and Schema.org JSON-LD helpers in `src/lib/seo/`.

## Directory Structure Overview

```text
src/
├── app/          # Next.js App Router (store & admin routes)
├── components/   # Shared UI primitives, layout & storefront/admin shells
├── features/     # Feature-oriented domain modules
├── lib/          # API client, SEO generators, Auth & formatters
├── hooks/        # Reusable custom React hooks
├── types/        # Global TypeScript definitions
└── config/       # Site, Navigation & Environment configurations
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript type check
npm run type-check

# Run ESLint
npm run lint

# Build production bundle
npm run build
```
