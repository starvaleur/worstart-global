# WORSTART GLOBAL

The official corporate website for WORSTART GLOBAL, an international trading and e-commerce company connecting businesses, products, and markets.

## Website

The homepage lives in `artifacts/website` and is served at the root preview path. It is a presentation-first React + Vite application with:

- Responsive desktop, tablet, and mobile layouts
- Semantic, accessibility-conscious sections and navigation
- SEO and Open Graph metadata
- Business capabilities, international markets, company vision, and partnership CTA
- Intentional placeholders for company details that still require confirmation

## Run locally in Replit

Start the managed website workflow:

```bash
pnpm --filter @workspace/website run dev
```

Check the website package:

```bash
pnpm --filter @workspace/website run typecheck
pnpm --filter @workspace/website run build
```

The website workflow supplies the required `PORT` and `BASE_PATH` values.

## Repository map

- `artifacts/website/` — deployable corporate website
- `artifacts/api-server/` — shared API service retained for future backend-backed features
- `lib/` — shared API contract, generated clients, and database packages
- `artifacts/mockup-sandbox/` — reusable visual prototyping tooling
- `docs/` — website architecture and confirmed-content guidance

The existing workspace architecture is intentionally preserved rather than replaced with a second application structure. See `docs/website-architecture.md` for the rationale and future extension points.

## Content before public launch

Confirm the legal company wording, official email, public address and phone details, social profile URLs, policies, final logo, and language requirements before publishing. Until then, keep the marked placeholders in place.