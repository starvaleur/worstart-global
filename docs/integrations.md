# Integrations, system of record and environment

## System of record
- **Supabase (Postgres)**: users/profiles, enquiries, shipments, orders, payments, appointments, visa requests, documents.
- **Payment providers**: authoritative for payment status. Our `payments.status` is written only from verified webhooks / server lookups.
- **HubSpot**: CRM view of contacts/companies/deals. Written from the server; never the source of operational data.
- **Formspree**: interim intake only (browser -> Formspree). Until a server intake route exists, enquiries do NOT reach Supabase or HubSpot.

Target flow: form -> server intake route -> insert `enquiries` (service role) -> `syncEnquiryContact` -> store `hubspot_contact_id`.

## Environment variables
Browser (public): `VITE_FORMSPREE_FORM_ID`, `VITE_API_URL`, (future) `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
Server only: `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SITE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `BANK_TRANSFER_INSTRUCTIONS`, `HUBSPOT_ACCESS_TOKEN`.
