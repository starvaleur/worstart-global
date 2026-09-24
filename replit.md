# WORSTART GLOBAL

The official corporate website for an international trading and e-commerce company connecting businesses, products, and markets.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/website/` — the root-served React + Vite corporate website
- `artifacts/api-server/` — shared Express API service for future backend features
- `lib/api-spec/openapi.yaml` — source of truth for shared API contracts
- `lib/db/src/schema/` — source of truth for shared database models
- `docs/website-architecture.md` — website architecture and milestone scope
- `docs/content-placeholders.md` — company-owned details that must be confirmed before launch

## Architecture decisions

- Milestone 1 is presentation-first and does not introduce database, authentication, or external integrations.
- The deployable site is an existing-workspace artifact at `artifacts/website`, preserving the repository's Replit routing and workflow conventions.
- Public content is limited to confirmed positioning, business areas, and initial markets; unknown company information stays explicitly marked as a placeholder.
- The shared API and database packages remain available for later workflows such as partnership enquiries or localization.

## Product

WORSTART GLOBAL presents the company to customers, suppliers, partners, and financial institutions. The homepage communicates its international trading and e-commerce positioning, business capabilities, initial markets, operating approach, and company vision.

## User preferences

- Keep the corporate experience modern, premium but restrained, international, and B2B-focused.
- Do not fabricate customer logos, statistics, addresses, phone numbers, financial information, or other company facts.

## Gotchas

- Confirm all company-owned placeholders before launch and domain connection.
- Run the website workflow with its managed environment rather than starting the Vite command without `PORT` and `BASE_PATH`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
