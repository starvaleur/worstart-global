import { Link } from 'wouter';
import { Layout } from '@/components/site/layout';
import { StoreLink } from '@/components/site/store-link';
import { Badge, Button, SectionHeader } from '@/components/site/ds';
import { openEnquiry, storeUrl, autoStoreUrl, machineryStoreUrl } from '@/lib/config';

type Dest = { id: string; n: string; name: string; line: string; body: string; live: boolean; external: string; actions: { label: string; service: string; kind?: 'primary' | 'secondary' }[] };

const destinations: Dest[] = [
  { id: 'general', n: '01', name: 'WORSTART General Store', line: 'Everyday essentials, thoughtfully selected.', body: 'Our Shopify store. Products, stock, cart, checkout and store orders are managed there, with the payment methods it offers.', live: true, external: storeUrl, actions: [] },
  { id: 'auto', n: '02', name: 'WORSTART Auto', line: 'Cars, parts and vehicle sourcing.', body: 'A planned storefront for new and used cars, automotive parts and accessories. It is not open yet and lists no vehicles or prices. Tell us what you need and our team will respond by email.', live: false, external: autoStoreUrl, actions: [{ label: 'Request a vehicle', service: 'Vehicle sourcing request', kind: 'primary' }, { label: 'Request parts or accessories', service: 'Automotive parts request', kind: 'secondary' }] },
  { id: 'machinery', n: '03', name: 'WORSTART Machinery', line: 'Industrial machinery, workshop equipment and spare parts.', body: 'A planned storefront for industrial machinery, workshop equipment and spare parts. It is not open yet and lists no equipment or prices. Send us a sourcing enquiry and our team will respond by email.', live: false, external: machineryStoreUrl, actions: [{ label: 'Request a quote', service: 'Machinery sourcing enquiry', kind: 'primary' }] },
];

export default function Shop() {
  return (
    <Layout><div className="page-shell container-wide">
      <p className="eyebrow">Store directory</p>
      <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[.95] tracking-[-.05em] md:text-8xl">Three stores.<br /><span className="text-[hsl(var(--accent))]">One route.</span></h1>
      <p className="mt-8 max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))]">WORSTART GLOBAL is organised into three commerce destinations. One is open today; the other two are in preparation and handled by request.</p>

      <div className="mt-16 border-t border-[hsl(var(--border))]">
        {destinations.map((d, i) => {
          const open = d.live || !!d.external;
          return (
            <section key={d.id} id={d.id} aria-labelledby={`h-${d.id}`} className={`grid scroll-mt-28 gap-6 border-b border-[hsl(var(--border))] py-10 md:py-14 lg:grid-cols-12 lg:gap-10 ${i === 1 ? 'lg:[&>div:first-child]:col-start-2' : ''}`}>
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4"><span className="font-mono-ui text-xs text-[hsl(var(--accent))]">{d.n}</span>{open ? <Badge tone="ok">Open</Badge> : <Badge tone="warn">Coming soon</Badge>}</div>
                <h2 id={`h-${d.id}`} className="mt-5 font-display text-4xl font-bold leading-[1] tracking-[-.04em] md:text-6xl">{d.name}</h2>
                <p className="mt-4 font-display text-xl text-[hsl(var(--muted-foreground))] md:text-2xl">{d.line}</p>
              </div>
              <div className="lg:col-span-5 lg:pt-3">
                <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">{d.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {open && d.id === 'general' && <StoreLink className="button-primary">Visit the General Store</StoreLink>}
                  {open && d.id !== 'general' && <a href={d.external} target="_blank" rel="noopener noreferrer" className="button-primary">Visit the store<span className="sr-only"> (opens in a new tab)</span></a>}
                  {d.actions.map((a) => <Button key={a.label} variant={a.kind === 'primary' && !open ? 'primary' : 'secondary'} onClick={() => openEnquiry({ service: a.service, description: `${a.label}:\n` })}>{a.label}</Button>)}
                </div>
                {!d.live && <p className="mt-4 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Requests are sent to our team by email. They are not connected to inventory or a checkout, and no price or availability is implied.</p>}
              </div>
            </section>
          );
        })}
      </div>
      <p className="mt-10 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">Shipping goods or vehicles internationally? That is a separate service: <Link href="/#contact" className="text-[hsl(var(--accent))] underline">start a logistics enquiry</Link>.</p>
    </div></Layout>
  );
}

export function Orders() {
  return (
    <Layout><div className="page-shell container-wide max-w-3xl">
      <SectionHeader eyebrow="Orders" title="Where are my orders?" body="Store orders are managed by Shopify. Freight and logistics requests are answered by email after you submit an enquiry." />
      <div className="mt-8 flex flex-wrap gap-3"><StoreLink className="button-primary">Visit the General Store</StoreLink><Link href="/services#tracking" className="button-secondary">Shipment visibility</Link></div>
    </div></Layout>
  );
}

export function Seller() {
  return (
    <Layout><div className="page-shell container-wide max-w-3xl">
      <SectionHeader eyebrow="DZ Seller" title="Sell globally. WORSTART handles the route." body="Seller onboarding is not live. Register your interest and we will contact you by email." />
      <Button className="mt-8" onClick={() => openEnquiry({ service: 'E-commerce / DZ Seller' })}>Register seller interest</Button>
    </div></Layout>
  );
}
