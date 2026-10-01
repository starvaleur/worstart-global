-- WORSTART GLOBAL core schema. Additive and idempotent: only CREATE ... IF NOT EXISTS, no drops, no data changes.
-- NOT YET APPLIED: the linked Supabase project was INACTIVE (paused) when this was written.
create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','seller','business','operations','admin');
-- (If the type already exists in your project, remove the line above before applying.)

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Role helper used by RLS. SECURITY DEFINER so policies can read profiles without recursion.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, phone text, company text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('operations','admin')) $$;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  kind text not null default 'logistics', name text not null, email text not null, phone text, company text,
  service text not null, origin text, destination text, details jsonb not null default '{}',
  status text not null default 'new', hubspot_contact_id text, created_at timestamptz not null default now()
);
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  enquiry_id uuid references public.enquiries(id) on delete set null, tracking_number text not null unique,
  status text not null default 'pending', origin text not null, destination text not null, estimated_arrival timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id) on delete cascade,
  label text not null, location text, occurred_at timestamptz not null, created_at timestamptz not null default now()
);
create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null, status text not null default 'pending', created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), seller_id uuid not null references public.sellers(id) on delete cascade,
  name text not null, category text not null, description text, price_minor integer not null check (price_minor >= 0),
  currency text not null default 'USD', published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, reference text not null unique,
  status text not null default 'pending_payment', total_minor integer not null check (total_minor >= 0), currency text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, name text not null,
  unit_minor integer not null check (unit_minor >= 0), qty integer not null check (qty > 0)
);
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(), order_id uuid references public.orders(id) on delete set null, reference text not null unique,
  provider text not null, provider_payment_id text, amount_minor integer not null check (amount_minor > 0), currency text not null,
  status text not null default 'pending', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  destination text not null, visa_type text not null, service_type text not null, preferred_date date, preferred_time time,
  status text not null default 'requested', created_at timestamptz not null default now()
);
create table if not exists public.visa_requests (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  destination text not null, visa_type text not null, applicant jsonb not null default '{}', status text not null default 'requested',
  created_at timestamptz not null default now()
);
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  shipment_id uuid references public.shipments(id) on delete set null, visa_request_id uuid references public.visa_requests(id) on delete set null,
  name text not null, storage_path text not null, created_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, body text, read_at timestamptz, created_at timestamptz not null default now()
);

create index if not exists idx_enquiries_user on public.enquiries(user_id);
create index if not exists idx_enquiries_email on public.enquiries(lower(email));
create index if not exists idx_shipments_user on public.shipments(user_id);
create index if not exists idx_shipment_events_shipment on public.shipment_events(shipment_id, occurred_at);
create index if not exists idx_products_seller on public.products(seller_id);
create index if not exists idx_products_published on public.products(category) where published;
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_payments_order on public.payments(order_id);
create index if not exists idx_appointments_user on public.appointments(user_id);
create index if not exists idx_visa_requests_user on public.visa_requests(user_id);
create index if not exists idx_documents_user on public.documents(user_id);
create index if not exists idx_notifications_user on public.notifications(user_id, read_at);

do $$ declare t text; begin
  foreach t in array array['profiles','shipments','products','orders','payments'] loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$s; create trigger trg_%1$s_updated before update on public.%1$s for each row execute function public.set_updated_at();', t);
  end loop;
  foreach t in array array['profiles','enquiries','shipments','shipment_events','sellers','products','orders','order_items','payments','appointments','visa_requests','documents','notifications'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- RLS: users see their own rows; staff see all. Writes to payments/shipments/orders status come from the
-- server using the service-role key (never shipped to the browser). Public enquiries are inserted server-side.
create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profiles self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "enquiries own read" on public.enquiries for select using (user_id = auth.uid() or public.is_staff());
create policy "shipments own read" on public.shipments for select using (user_id = auth.uid() or public.is_staff());
create policy "shipment_events own read" on public.shipment_events for select using (exists (select 1 from public.shipments s where s.id = shipment_id and (s.user_id = auth.uid() or public.is_staff())));
create policy "sellers own" on public.sellers for select using (user_id = auth.uid() or public.is_staff());
create policy "products public read" on public.products for select using (published or exists (select 1 from public.sellers s where s.id = seller_id and s.user_id = auth.uid()) or public.is_staff());
create policy "products seller write" on public.products for all using (exists (select 1 from public.sellers s where s.id = seller_id and s.user_id = auth.uid())) with check (exists (select 1 from public.sellers s where s.id = seller_id and s.user_id = auth.uid()));
create policy "orders own read" on public.orders for select using (user_id = auth.uid() or public.is_staff());
create policy "order_items own read" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())));
create policy "payments own read" on public.payments for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())) or public.is_staff());
create policy "appointments own" on public.appointments for select using (user_id = auth.uid() or public.is_staff());
create policy "visa_requests own" on public.visa_requests for select using (user_id = auth.uid() or public.is_staff());
create policy "documents own" on public.documents for select using (user_id = auth.uid() or public.is_staff());
create policy "notifications own" on public.notifications for select using (user_id = auth.uid());
create policy "notifications own update" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
