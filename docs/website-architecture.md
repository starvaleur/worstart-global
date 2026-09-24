# WORSTART GLOBAL Website Architecture

## Purpose

The official WORSTART GLOBAL website is the public-facing corporate presence for an international trading and e-commerce company connecting businesses, products, and markets.

## Current workspace mapping

This repository uses the existing Replit pnpm workspace layout:

- `artifacts/website/` — the deployable React + Vite website
- `artifacts/api-server/` — the shared Express API service, retained for future server-backed features
- `lib/` — shared API, database, and generated client packages
- `artifacts/mockup-sandbox/` — reusable design-preview tooling
- `docs/` — product and architecture documentation

The website intentionally remains a presentation-first experience in Milestone 1. It does not require a database, authentication, or external integrations.

## Homepage contract

The first milestone covers:

1. Navigation
2. Corporate introduction
3. Business capabilities
4. Initial international markets
5. Reasons to work with WORSTART GLOBAL
6. Company vision
7. Business contact CTA
8. Professional footer

All public claims are limited to the positioning, business areas, and markets supplied by the company. Company contact details, legal information, registrations, and social links must be added only after confirmation.

## Future extension points

- Add confirmed company information through a reviewed content source, not ad-hoc copy in UI components.
- Connect a contact or partnership form through the shared API service once the required workflow and destination are confirmed.
- Add localized pages only after the canonical English content and language requirements are approved.
- Connect `worstartglobal.com` through the deployment configuration once the production domain is available.

## Quality requirements

- Semantic HTML and accessible interactive states
- Responsive layout across mobile, tablet, and desktop
- Stable SEO metadata and social sharing metadata
- No fabricated customer logos, statistics, addresses, phone numbers, or financial information
- Keep the homepage lightweight and avoid adding dependencies without a clear user-facing need