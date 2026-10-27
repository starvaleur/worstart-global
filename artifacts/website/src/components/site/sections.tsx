import { useState, type ReactNode } from 'react';
import {
  ArrowUpRight, Anchor, Banknote, Boxes, Car, CreditCard, FileText, Globe2, PackageCheck, Plane, Search,
  ShieldCheck, ShoppingCart, Store, Truck, Warehouse, Ship, Landmark, CalendarClock, Check,
} from 'lucide-react';
import { openEnquiry } from '@/lib/config';
import { lookupShipment, type TrackingResult } from '@/lib/tracking';

const Soon = ({ children = 'Coming soon' }: { children?: ReactNode }) => (
  <span className="inline-flex items-center border border-[hsl(var(--border))] px-2 py-1 font-mono-ui text-[0.55rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{children}</span>
);

function Head({ eyebrow, title, body, dark }: { eyebrow: string; title: string; body: string; dark?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
      <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[1] tracking-[-.045em] md:text-5xl">{title}</h2></div>
      <p className={`max-w-xl text-base leading-7 lg:pt-8 ${dark ? 'text-[hsl(var(--primary-foreground)/.66)]' : 'text-[hsl(var(--muted-foreground))]'}`}>{body}</p>
    </div>
  );
}

const Flow = ({ steps, dark }: { steps: string[]; dark?: boolean }) => (
  <ol className="flow-list mt-10 grid gap-px sm:grid-cols-3 lg:grid-cols-6" aria-label="Process flow">
    {steps.map((s, i) => (
      <li key={s} className={`relative p-4 font-mono-ui text-[0.62rem] uppercase tracking-[.12em] ${dark ? 'bg-[hsl(var(--primary-foreground)/.06)]' : 'bg-[hsl(var(--secondary))]'}`}>
        <span className="text-[hsl(var(--accent))]">{String(i + 1).padStart(2, '0')}</span><br />{s}
      </li>
    ))}
  </ol>
);

/* ---------- IMPORT & EXPORT ---------- */
const intents = [
  { id: 'Import goods', icon: Boxes, text: 'Supplier coordination, freight arrangement, import documents and delivery coordination for commercial goods.', flow: ['Route brief', 'Supplier coordination', 'Freight', 'Import documents', 'Customs support', 'Delivery'] },
  { id: 'Export goods', icon: Truck, text: 'Buyer coordination, export documentation, freight arrangement and cargo handoff to your destination market.', flow: ['Route brief', 'Buyer coordination', 'Export documents', 'Freight', 'Customs support', 'Handoff'] },
  { id: 'Import a car', icon: Car, text: 'Vehicle sourcing and purchase assistance, documentation, international transport, port and customs coordination.', flow: ['Vehicle request', 'Sourcing', 'Documents', 'Transport', 'Customs support', 'Delivery'] },
  { id: 'Export a car', icon: Car, text: 'Documentation and port coordination, international vehicle shipping and destination handoff.', flow: ['Vehicle details', 'Documents', 'Port', 'Shipping', 'Customs support', 'Handoff'] },
  { id: 'Commercial cargo', icon: Ship, text: 'Full or partial container, air, sea or road freight for commercial shipments.', flow: ['Route brief', 'Mode selection', 'Documents', 'Booking', 'Transit', 'Handoff'] },
  { id: 'Personal cargo', icon: PackageCheck, text: 'Personal shipments handled door-to-door or port-to-port, with documentation guidance.', flow: ['Route brief', 'Packing', 'Documents', 'Booking', 'Transit', 'Delivery'] },
];

export function ImportExportSection() {
  const [id, setId] = useState(intents[0].id);
  const cur = intents.find((i) => i.id === id)!;
  return (
    <section id="import-export" className="bg-[hsl(var(--background))] py-20 md:py-28">
      <div className="container-wide">
        <Head eyebrow="Import & export" title="Tell us what you want to move." body="Choose your goal to see how a WORSTART route is structured. Every route is confirmed per movement — nothing here is a quote." />
        <fieldset className="mt-12">
          <legend className="field-label">I want to</legend>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="I want to">
            {intents.map((i) => (
              <button key={i.id} type="button" role="radio" aria-checked={id === i.id} onClick={() => setId(i.id)}
                className={`min-h-11 border px-4 text-sm font-semibold transition-colors ${id === i.id ? 'border-[hsl(var(--accent))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]'}`} data-testid={`intent-${i.id}`}>{i.id}</button>
            ))}
          </div>
        </fieldset>
        <div className="mt-8 border border-[hsl(var(--border))] p-6 md:p-9" aria-live="polite">
          <cur.icon className="h-6 w-6 text-[hsl(var(--accent))]" strokeWidth={1.5} />
          <h3 className="mt-5 font-display text-2xl font-bold">{cur.id}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{cur.text}</p>
          <Flow steps={cur.flow} />
          <button type="button" className="button-primary mt-8" onClick={() => openEnquiry({ service: cur.id })} data-testid="intent-cta">Start a logistics enquiry <ArrowUpRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

/* ---------- CARS ---------- */
const carCards = [
  ['Source a vehicle', 'Import goods', 'Vehicle request and sourcing assistance.'],
  ['Import a vehicle', 'Import a car', 'Documents, transport, port and customs coordination.'],
  ['Export a vehicle', 'Export a car', 'Documentation, port coordination and handoff.'],
  ['Ship a vehicle', 'Import a car', 'International vehicle shipping.'],
  ['Lease a vehicle', 'Vehicle leasing / booking', 'Leasing requests — no inventory is listed yet.'],
  ['Book a vehicle', 'Vehicle leasing / booking', 'Booking requests — availability is confirmed by our team.'],
] as const;

export function CarsSection() {
  return (
    <section id="cars" className="bg-[hsl(var(--secondary))] py-20 md:py-28">
      <div className="container-wide">
        <Head eyebrow="Cars" title="Vehicles, sourced and moved." body="Vehicle sourcing, import, export and shipping coordination. We do not list vehicle inventory yet — every vehicle is handled by request." />
        <div className="mt-12 grid gap-px bg-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-3">
          {carCards.map(([title, service, text]) => (
            <article key={title} className="flex flex-col bg-[hsl(var(--background))] p-6">
              <Car className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{text}</p>
              <button type="button" className="service-detail-toggle mt-5 self-start" onClick={() => openEnquiry({ service })}>Request vehicle <ArrowUpRight className="h-3.5 w-3.5" /></button>
            </article>
          ))}
        </div>
        <p className="mt-5 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]"><Soon>Marketplace coming soon</Soon> A searchable vehicle marketplace is a future feature and is not live.</p>
      </div>
    </section>
  );
}

/* ---------- FREIGHT + FULFILLMENT + CUSTOMS ---------- */
const modes = [
  [Plane, 'Air freight'], [Ship, 'Sea freight'], [Truck, 'Road freight'], [Globe2, 'Multimodal'],
  [Boxes, 'Full / partial container'], [PackageCheck, 'Door-to-door'], [Anchor, 'Port-to-port'], [Warehouse, 'Warehouse-to-door'],
] as const;
const customs = ['Customs coordination', 'Commercial invoice coordination', 'Packing list', 'Import & export documents', 'Certificates & document coordination', 'Compliance workflow', 'Customs broker coordination where applicable'];

export function LogisticsSection() {
  return (
    <section id="logistics" className="bg-[hsl(var(--primary))] py-20 text-[hsl(var(--primary-foreground))] md:py-28">
      <div className="container-wide">
        <Head dark eyebrow="Goods & freight" title="Every mode. One coordinated route." body="Tell us origin, destination, cargo type, weight, volume and timeline. We reply with a proposal — no price is generated automatically." />
        <div className="mt-12 grid grid-cols-2 gap-px bg-[hsl(var(--primary-foreground)/.18)] md:grid-cols-4">
          {modes.map(([Icon, label]) => (
            <div key={label} className="bg-[hsl(var(--primary))] p-5"><Icon className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} /><p className="mt-5 text-sm font-semibold">{label}</p></div>
          ))}
        </div>
        <button type="button" className="button-cta-outline mt-8" onClick={() => openEnquiry({ service: 'Commercial cargo' })}>Request a quote <ArrowUpRight className="h-4 w-4" /></button>

        <div id="fulfillment" className="mt-20 scroll-mt-24">
          <p className="eyebrow">Fulfillment & warehousing</p>
          <h3 className="mt-4 font-display text-3xl font-bold tracking-[-.03em]">From supplier to customer, through one hub.</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[hsl(var(--primary-foreground)/.66)]">Receiving, storage, picking, packing, dispatch, distribution and returns coordination, including cross-border fulfillment. Warehouse locations are confirmed per engagement.</p>
          <Flow dark steps={['Supplier', 'WORSTART warehouse', 'Processing', 'Packing', 'Shipment', 'Customer']} />
        </div>

        <div id="customs" className="mt-20 scroll-mt-24">
          <p className="eyebrow">Customs & documentation</p>
          <h3 className="mt-4 font-display text-3xl font-bold tracking-[-.03em]">Documentation coordination, done carefully.</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[hsl(var(--primary-foreground)/.66)]">Professional assistance and customs support. WORSTART is not a government authority and does not grant approvals.</p>
          <ul className="mt-8 grid gap-px bg-[hsl(var(--primary-foreground)/.18)] sm:grid-cols-2">
            {customs.map((c) => <li key={c} className="flex items-center gap-3 bg-[hsl(var(--primary))] p-4 text-sm"><FileText className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRACKING ---------- */
export function TrackingSection() {
  const [num, setNum] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<TrackingResult | null>(null);
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (num.trim().length < 4) { setErr('Enter a tracking number (at least 4 characters).'); setRes(null); return; }
    setErr(''); setBusy(true);
    try { setRes(await lookupShipment(num.trim())); } finally { setBusy(false); }
  }
  return (
    <section id="tracking" className="bg-[hsl(var(--background))] py-20 md:py-28">
      <div className="container-wide">
        <Head eyebrow="Shipment visibility" title="Track your shipment." body="Live tracking is not connected yet. Your data model is ready for tracking number, status, origin, destination, ETA, milestones and documents once a carrier integration exists." />
        <form onSubmit={submit} className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row" noValidate>
          <label className="flex-1"><span className="field-label">Tracking number</span>
            <input value={num} onChange={(e) => setNum(e.target.value)} className="field-input" aria-invalid={!!err} aria-describedby="track-msg" data-testid="input-tracking" /></label>
          <button type="submit" disabled={busy} className="button-primary self-end disabled:opacity-50" data-testid="button-track"><Search className="h-4 w-4" />{busy ? 'Checking…' : 'Track'}</button>
        </form>
        <div id="track-msg" role="status" aria-live="polite" className="mt-5 max-w-xl text-sm leading-6">
          {err && <p className="text-[hsl(var(--destructive))]">{err}</p>}
          {res?.state === 'not_configured' && (
            <div className="border border-[hsl(var(--border))] p-5">
              <p>Tracking integration is being prepared. Submit your enquiry and our team will provide shipment updates.</p>
              <button type="button" className="service-detail-toggle mt-4" onClick={() => openEnquiry({ service: 'Commercial cargo', description: `Shipment update request for tracking number ${num.trim()}.` })}>Ask for an update <ArrowUpRight className="h-3.5 w-3.5" /></button>
            </div>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- COMMERCE + PAYMENTS ---------- */
const commerceFlow = ['Seller', 'Product', 'Cart', 'Checkout', 'Payment', 'Order', 'Fulfillment', 'Shipping', 'Tracking'];
const providers = [
  [CreditCard, 'Card payments'], [Banknote, 'Bank transfer'], [Landmark, 'Stripe'], [ShieldCheck, 'PayPal'], [Globe2, 'Regional gateways'],
] as const;

export function CommerceSection() {
  return (
    <section id="commerce" className="bg-[hsl(var(--secondary))] py-20 md:py-28">
      <div className="container-wide">
        <Head eyebrow="E-commerce & payments" title="Product, seller, buyer, payment and delivery — connected." body="The commerce foundation is being built. No products are listed, no checkout is live and no payment can be taken today." />
        <ol className="mt-10 flex flex-wrap items-center gap-2" aria-label="Commerce flow">
          {commerceFlow.map((s, i) => <li key={s} className="flex items-center gap-2 font-mono-ui text-[0.62rem] uppercase tracking-[.12em]"><span className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2">{s}</span>{i < commerceFlow.length - 1 && <span aria-hidden className="text-[hsl(var(--accent))]">→</span>}</li>)}
        </ol>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6" id="dz-seller">
            <Store className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} />
            <h3 className="mt-5 font-display text-2xl font-bold">DZ Seller</h3>
            <p className="mt-1 text-sm font-semibold">Sell globally. WORSTART handles the route.</p>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Seller onboarding, product management, orders, fulfillment, shipping, payment and customer management.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3"><Soon /><button type="button" className="service-detail-toggle" onClick={() => openEnquiry({ service: 'E-commerce / DZ Seller' })}>Register interest <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
          </article>
          <article className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6" id="payments">
            <CreditCard className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} />
            <h3 className="mt-5 font-display text-2xl font-bold">Multi-provider payments</h3>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">WORSTART operates through a US LLC. Payments run through a provider-agnostic server layer; availability varies by country and provider. Card data never touches this site.</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {providers.map(([Icon, l]) => <li key={l} className="flex items-center gap-2 border border-[hsl(var(--border))] p-3"><Icon className="h-4 w-4 text-[hsl(var(--accent))]" />{l}</li>)}
            </ul>
            <p className="mt-4"><Soon>Payment provider not configured</Soon></p>
            <a href="/shop" className="service-detail-toggle mt-4">Open the shop (demo catalogue) <ArrowUpRight className="h-3.5 w-3.5" /></a>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- VISA + APPOINTMENTS ---------- */
const destinations = ['USA', 'Europe / Schengen', 'UK', 'UAE', 'China', 'Türkiye', 'Other destination'];
const visaTypes: Record<string, string[]> = {
  Tourist: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Travel itinerary', 'Proof of accommodation', 'Proof of funds'],
  Business: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Invitation or company letter', 'Business registration documents', 'Proof of funds'],
  Student: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Admission letter', 'Proof of funds', 'Academic records'],
  Work: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Employment offer or contract', 'Qualification records'],
  Transit: ['Valid passport', 'Onward ticket', 'Destination visa or entry proof, if required'],
};
const steps = ['Destination', 'Visa type', 'Checklist', 'Request assistance'];
const svc = ['Consultation', 'Document review', 'Application assistance', 'Appointment assistance'];

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={`min-h-11 border px-4 text-sm font-semibold ${on ? 'border-[hsl(var(--accent))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]'}`}>{children}</button>
  )
}

export function VisaSection() {
  const [dest, setDest] = useState('');
  const [type, setType] = useState('');
  const [service, setService] = useState(svc[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const step = !dest ? 0 : !type ? 1 : 2;
  const summary = `Destination: ${dest}\nVisa type: ${type}\nService: ${service}${date ? `\nPreferred date: ${date}` : ''}${time ? `\nPreferred time: ${time}` : ''}`;
  return (
    <section id="visa" className="bg-[hsl(var(--background))] py-20 md:py-28">
      <div className="container-wide">
        <Head eyebrow="Visa assistance & appointments" title="Prepared applications. Supported appointments." body="Application support and document preparation. WORSTART is not a government authority, does not guarantee visa approval and cannot see official appointment availability." />
        <ol className="mt-10 flex flex-wrap gap-2" aria-label="Visa workflow">
          {steps.map((s, i) => <li key={s} className={`border px-3 py-2 font-mono-ui text-[0.6rem] uppercase tracking-[.12em] ${i <= step ? 'border-[hsl(var(--accent))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'}`}>{String(i + 1).padStart(2, '0')} {s}</li>)}
        </ol>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="field-label">1 · Destination</p>
            <div className="mt-3 flex flex-wrap gap-2">{destinations.map((d) => <Pill key={d} on={dest === d} onClick={() => setDest(d)}>{d}</Pill>)}</div>
            <p className="field-label mt-8">2 · Visa type</p>
            <div className="mt-3 flex flex-wrap gap-2">{Object.keys(visaTypes).map((t) => <Pill key={t} on={type === t} onClick={() => setType(t)}>{t}</Pill>)}</div>
          </div>
          <div className="border border-[hsl(var(--border))] p-6" aria-live="polite">
            <p className="field-label">3 · Document checklist</p>
            {type ? (
              <>
                <ul className="mt-4 space-y-2 text-sm">{visaTypes[type].map((d) => <li key={d} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />{d}</li>)}</ul>
                <p className="mt-4 text-xs leading-5 text-[hsl(var(--muted-foreground))]">General checklist only. Requirements differ by destination and change often — always confirm with the official authority{dest ? ` for ${dest}` : ''}.</p>
              </>
            ) : <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Select a destination and visa type to see a general checklist.</p>}
          </div>
        </div>

        <div id="appointments" className="mt-14 border border-[hsl(var(--border))] p-6 md:p-9">
          <div className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} /><h3 className="font-display text-2xl font-bold">Request appointment assistance</h3><a href="/visa" className="service-detail-toggle ml-auto">Full visa experience <ArrowUpRight className="h-3.5 w-3.5" /></a></div>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Appointment availability must be confirmed. Submitting this creates a request for our team, not a booking.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label><span className="field-label">Service</span><select className="field-input" value={service} onChange={(e) => setService(e.target.value)}>{svc.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label><span className="field-label">Preferred date</span><input type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <label><span className="field-label">Preferred time</span><input type="time" className="field-input" value={time} onChange={(e) => setTime(e.target.value)} /></label>
            <button type="button" disabled={!dest || !type} className="button-primary self-end disabled:opacity-50"
              onClick={() => openEnquiry({ kind: 'appointment', service: 'Visa appointment assistance', description: summary })}>Request assistance <ArrowUpRight className="h-4 w-4" /></button>
          </div>
          {(!dest || !type) && <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">Choose a destination and visa type above first.</p>}
        </div>
      </div>
    </section>
  );
}

/* ---------- ECOSYSTEM TREE ---------- */
const eco = [
  ['Shipping', 'Live as an enquiry service', 'live'], ['Import & export', 'Live as an enquiry service', 'live'], ['Visa services', 'Assistance requests', 'live'],
  ['E-commerce', 'Foundation in progress', 'soon'], ['DZ Seller', 'Seller platform', 'soon'], ['Payments', 'Provider layer, not enabled', 'soon'],
  ['Bank Online', 'Business payment & financial services concept — not a bank, no regulated services live', 'soon'],
  ['Car leasing & booking', 'Requests only, no inventory', 'live'], ['Maritime transport', 'Future module', 'soon'],
] as const;

export function EcosystemStatus() {
  return (
    <div className="container-wide pb-20 md:pb-28">
      <div className="grid gap-px bg-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="WORSTART GLOBAL ecosystem status">
        {eco.map(([n, d, s]) => (
          <div role="listitem" key={n} className="flex flex-col gap-3 bg-[hsl(var(--background))] p-5">
            <div className="flex items-center justify-between"><h3 className="font-display text-lg font-bold">{n}</h3>{s === 'soon' ? <Soon /> : <Soon>Enquiry-based</Soon>}</div>
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
