import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Handshake,
  MapPinned,
  Menu,
  Route,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Layout, BrandMark } from '@/components/site/layout';
import Shop, { Orders, Seller } from '@/pages/store';
import { Visa, VisaRequest, Appointments } from '@/pages/visa';
import Dashboard from '@/pages/dashboard';
import Services from '@/pages/services';
import { Photo, TrustedBy, hasPhoto } from '@/components/site/media';
import { EnquiryModal } from '@/components/site/enquiry';
import { ServiceFeatures, StoreSection, LimitsSection } from '@/components/site/sections';
import { ENQUIRY_EVENT, openEnquiry, type EnquiryPreset } from '@/lib/config';
import {
  Route as WouterRoute,
  Switch,
  useLocation,
  Router as WouterRouter,
  Redirect,
} from 'wouter';

const queryClient = new QueryClient();

const markets = [
  { name: 'Algeria', code: 'DZ', note: 'North Africa', route: 'Origin context and regional handoffs.' },
  { name: 'China', code: 'CN', note: 'East Asia', route: 'Supplier-side movement and documentation.' },
  { name: 'European Union', code: 'EU', note: 'Europe', route: 'Cross-border receiving and onward routes.' },
  { name: 'Türkiye', code: 'TR', note: 'Eurasia', route: 'A connected point between regions.' },
  { name: 'United Arab Emirates', code: 'AE', note: 'Gulf region', route: 'Gulf-side movement and coordination.' },
  { name: 'United States', code: 'US', note: 'North America', route: 'A wider destination context.' },
];

const capabilities = [
  {
    number: '01',
    icon: Route,
    title: 'Freight & logistics',
    body: 'Planning clear movement across borders, routes and handoffs for the goods that keep business moving.',
    bullets: ['Route and carrier context', 'Origin-to-destination coordination', 'Confirmed handoff planning'],
  },
  {
    number: '02',
    icon: Boxes,
    title: 'Fulfillment & warehousing',
    body: 'Creating practical space between arrival and onward movement, from receiving to dispatch.',
    bullets: ['Receiving and dispatch readiness', 'Inventory handoff context', 'Onward movement planning'],
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Customs & documentation',
    body: 'Keeping the information around a shipment organized, ready for the conversations that move it forward.',
    bullets: ['Document readiness review', 'Customs conversation context', 'Information handoff coordination'],
  },
  {
    number: '04',
    icon: Handshake,
    title: 'Shipment visibility',
    body: 'Making the route easier to understand with clearer updates, ownership and next steps.',
    bullets: ['Milestone-based updates', 'Next-step ownership', 'Visibility between handoffs'],
  },
];

const ecosystemLayers = [
  {
    number: '01',
    icon: ShieldCheck,
    name: 'Bank Online',
    label: 'Financial ecosystem',
    body: 'A future connection point for the payment, trust and business workflows around movement.',
  },
  {
    number: '02',
    icon: Boxes,
    name: 'DZ Seller',
    label: 'Marketplace ecosystem',
    body: 'A route from seller and product to buyer, with logistics considered as part of the commerce experience.',
  },
  {
    number: '03',
    icon: Route,
    name: 'Car leasing & booking',
    label: 'Mobility ecosystem',
    body: 'A complementary layer for vehicle movement, booking workflows and related documentation.',
  },
  {
    number: '04',
    icon: Globe2,
    name: 'Maritime transport',
    label: 'Future expansion',
    body: 'A future direction for extending the network into broader freight and ocean movement.',
  },
];

const processSteps = [
  {
    number: '01',
    icon: MapPinned,
    title: 'Route brief',
    body: 'Start with origin, destination, cargo context and the service need around the move.',
  },
  {
    number: '02',
    icon: FileCheck2,
    title: 'Documentation review',
    body: 'Bring the information and documents needed for the next logistics conversation into view.',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Freight & fulfillment coordination',
    body: 'Coordinate the movement, receiving, dispatch and partner or carrier handoffs.',
  },
  {
    number: '04',
    icon: ClipboardCheck,
    title: 'Confirmed handoff & visibility',
    body: 'Keep the next confirmed milestone and responsible party clear as the route develops.',
  },
];

const principles = [
  { number: '01', title: 'Route clarity', body: 'A shared view of where the move begins, where it is going and what comes next.' },
  { number: '02', title: 'Document readiness', body: 'The right information in view before a handoff depends on it.' },
  { number: '03', title: 'Handoff coordination', body: 'Clear ownership between businesses, partners, carriers and receiving points.' },
  { number: '04', title: 'Milestone visibility', body: 'Updates tied to confirmed moments rather than vague promises.' },
];

const coordinationItems = [
  'Freight coordination',
  'Fulfillment readiness',
  'Documentation coordination',
  'Milestone visibility',
  'Partner and carrier confirmation',
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<EnquiryPreset | null>(null);
  const contactOpen = enquiry !== null;
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.title = 'WORSTART GLOBAL | International Logistics, Import & Export';
    const description = 'WORSTART GLOBAL connects businesses and individuals to international import and export, freight, vehicles, fulfillment, customs support, e-commerce, payments and visa assistance.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    const setOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setOg('og:title', 'WORSTART GLOBAL | International Logistics, Import & Export');
    setOg('og:description', description);
    setOg('og:type', 'website');
    const setNameMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setNameMeta('twitter:title', 'WORSTART GLOBAL | International Logistics, Import & Export');
    setNameMeta('twitter:description', description);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => setEnquiry((e as CustomEvent<EnquiryPreset>).detail ?? {});
    window.addEventListener(ENQUIRY_EVENT, onOpen);
    return () => window.removeEventListener(ENQUIRY_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen && !contactOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (menuOpen) closeMenu();
      if (contactOpen) setEnquiry(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, contactOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => firstMenuItemRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };
  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
      return;
    }
    setMenuOpen(true);
  };
  const openContactFromMenu = () => {
    closeMenu();
    openEnquiry();
  };

  return (
    <Layout>

      <div id="top">
        <section className="hero-section">
          <div className="container-wide grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div className="hero-copy">
              <p className="eyebrow">International freight &amp; logistics</p>
              <h1 className="mt-5 text-balance font-display">Goods move. We make the route.</h1>
              <p className="mt-6">WORSTART GLOBAL coordinates freight, import and export, vehicles, fulfillment and customs support across the markets your business depends on.</p>
              <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={() => openEnquiry()} className="button-primary" data-testid="link-hero-contact">Get a quote <ArrowUpRight className="h-4 w-4" /></button>
                <a href="/services" className="button-secondary" data-testid="link-hero-markets">Explore services</a>
              </div>
            </div>
            {hasPhoto('hero') ? <Photo id="hero" priority className="aspect-[4/5]" /> : (
              <div aria-label="Markets served">
                <p className="text-base font-semibold text-[hsl(var(--foreground))]">Markets served</p>
                <ul className="mt-3 border-t border-[hsl(var(--border))]">{['Algeria', 'China', 'Europe', 'Türkiye', 'UAE', 'USA'].map((m) => <li key={m} className="border-b border-[hsl(var(--border))] py-3 text-3xl font-bold tracking-[-.02em] text-[hsl(var(--foreground))] md:text-4xl">{m}</li>)}</ul>
              </div>
            )}
          </div>
        </section>

        <TrustedBy />

        <ServiceFeatures />

        <section id="markets" className="relative overflow-hidden bg-[hsl(var(--primary))] py-20 text-[hsl(var(--primary-foreground))] md:py-28 lg:py-32">
          <div className="markets-orbit markets-orbit-large absolute right-[-10%] top-[-18%] h-[520px] w-[520px] rounded-full" />
          <div className="markets-orbit markets-orbit-small absolute right-[-3%] top-[-8%] h-[390px] w-[390px] rounded-full" />
          <div className="container-wide relative z-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Network / initial market view</p>
                <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[.98] tracking-[-.05em] md:text-6xl">Six markets.<br /><span className="text-[hsl(var(--accent))]">Clearer movement between them.</span></h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[hsl(var(--primary-foreground)/.62)]">An initial network view across North Africa, Asia, Europe, Eurasia, the Gulf region and North America. Route details are confirmed per movement.</p>
            </div>
            <div className="markets-rail mt-14 md:mt-16" tabIndex={0} aria-label="WORSTART market network">
              {markets.map((market, index) => (
                <article key={market.code} className="market-card group relative min-h-[190px] bg-[hsl(var(--primary))] p-5 md:min-h-[220px] md:p-7" data-testid={`card-market-${market.code}`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono-ui text-xs text-[hsl(var(--accent))]">{String(index + 1).padStart(2, '0')}</span>
                    <ArrowUpRight className="h-4 w-4 text-[hsl(var(--primary-foreground)/.38)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <div className="mt-8">
                    <h3 className="market-title font-display text-2xl font-bold tracking-[-.035em]">{market.name}</h3>
                    <p className="mt-2 font-mono-ui text-[0.58rem] uppercase tracking-[.13em] text-[hsl(var(--primary-foreground)/.48)]">{market.note}</p>
                    <p className="market-route mt-5 max-w-[18rem] text-sm leading-6 text-[hsl(var(--primary-foreground)/.64)]">{market.route}</p>
                  </div>
                </article>
              ))}
            </div>
              <div className="mt-7 flex items-center justify-between gap-3 font-mono-ui text-[0.62rem] uppercase tracking-[.13em] text-[hsl(var(--primary-foreground)/.48)]">
              <span className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-[hsl(var(--accent))]" /> Route descriptions, not performance claims</span>
              <span className="hidden sm:inline">Scroll / drag to explore</span>
            </div>
          </div>
        </section>

        <section id="ecosystem" className="bg-[hsl(var(--background))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="eyebrow">Ecosystem / movement layer</p>
                <h2 className="mt-5 max-w-lg font-display text-4xl font-bold leading-[.98] tracking-[-.05em] text-[hsl(var(--foreground))] md:text-6xl">One logistics layer connecting digital and physical business.</h2>
              </div>
              <div className="max-w-xl lg:pt-10">
                <p className="text-lg leading-8 text-[hsl(var(--muted-foreground))]">WORSTART SHIPPING is designed to sit between the workflows that create demand and the handoffs that move goods: finance, commerce, mobility and future maritime expansion.</p>
              </div>
            </div>
            <div className="ecosystem-map mt-14">
              <div className="ecosystem-center">
                <span className="font-mono-ui text-[0.58rem] uppercase tracking-[.15em] text-[hsl(var(--accent))]">Movement layer</span>
                <strong className="mt-3 font-display text-3xl tracking-[-.05em]">WORSTART<br />SHIPPING</strong>
                <span className="mt-4 max-w-[13rem] text-xs leading-5 text-[hsl(var(--primary-foreground)/.62)]">Route, fulfillment and handoff context between ecosystem services.</span>
              </div>
              <div className="ecosystem-connectors" aria-hidden="true"><span /><span /><span /><span /></div>
              {ecosystemLayers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <article key={layer.number} className={`ecosystem-card ecosystem-card-${layer.number}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-xs text-[hsl(var(--accent))]">{layer.number}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground)/.65)]">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-8 font-mono-ui text-[0.58rem] uppercase tracking-[.13em] text-[hsl(var(--accent))]">{layer.label}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-[-.035em] text-[hsl(var(--foreground))]">{layer.name}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{layer.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <StoreSection />
        <LimitsSection />

        <section id="approach" className="page-grid bg-[hsl(var(--secondary))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
              <div>
                <p className="eyebrow">How it works / intended operating model</p>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[.98] tracking-[-.05em] text-[hsl(var(--foreground))] md:text-6xl">A clear path from origin to the next confirmed handoff.</h2>
                <p className="mt-7 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">This is the intended way to structure a logistics conversation. It is not a live shipment timeline.</p>
              </div>
              <div>
                <div className="process-timeline">
                  <div className="process-line" aria-hidden="true" />
                  {processSteps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <article key={step.number} className="process-step reveal-on-scroll">
                        <div className="process-step-marker">
                          <span>{step.number}</span>
                        </div>
                        <div className="process-step-copy">
                          <Icon className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} aria-hidden="true" />
                          <h3 className="mt-4 font-display text-xl font-bold text-[hsl(var(--foreground))]">{step.title}</h3>
                          <p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{step.body}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--background))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="grid gap-10">
              <div className="max-w-3xl">
                <p className="eyebrow">What we coordinate</p>
                <h2 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[.98] tracking-[-.05em] text-[hsl(var(--foreground))] md:text-6xl">Less ambiguity between one move and the next.</h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">The logistics layer is where cargo context, documents, service need and partner confirmation meet. We keep that conversation structured.</p>
                <div className="coordination-list mt-10 border-t border-[hsl(var(--border))]">
                  {coordinationItems.map((item) => (
                    <div key={item} className="coordination-item"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />{item}<ArrowUpRight className="ml-auto h-4 w-4 text-[hsl(var(--accent))]" /></div>
                  ))}
                </div>
                <a href="#contact" className="button-secondary mt-8">Start with route context <ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--background))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="grid items-end gap-10 md:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow">Future direction</p>
                <h2 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[.95] tracking-[-.06em] text-[hsl(var(--foreground))] md:text-7xl">Make every handoff feel<br /><span className="text-[hsl(var(--accent))]">clearer to business.</span></h2>
              </div>
              <p className="max-w-xs border-l border-[hsl(var(--border))] pl-5 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Our direction is simple: make freight movement easier to understand across the markets and ecosystem services that matter.</p>
            </div>
            <div className="mt-16 flex flex-col justify-between gap-8 border-t border-[hsl(var(--border))] pt-6 text-[hsl(var(--muted-foreground))] sm:flex-row">
              <p className="font-mono-ui text-[0.62rem] uppercase tracking-[.15em]">Direction / future expansion</p>
              <p className="max-w-md text-sm leading-6">From Algeria to China, from the European Union to the United States—WORSTART SHIPPING is building toward a wider movement network, with maritime transport explicitly held as a future horizon.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[hsl(var(--background))] px-0 py-20 md:py-28">
          <div className="container-wide">
            <div className="contact-panel relative overflow-hidden rounded-[2rem] bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))] md:p-12 lg:p-16">
              <div className="cta-orbit cta-orbit-large absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full md:right-[8%]" />
              <div className="cta-orbit cta-orbit-small absolute -right-2 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full md:right-[12%]" />
              <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center lg:gap-20">
                <div>
                  <p className="eyebrow">Start a logistics enquiry</p>
                  <h2 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[.93] tracking-[-.06em] md:text-7xl">Move goods<br /><span className="text-[hsl(var(--accent))]">with clarity.</span></h2>
                  <p className="mt-7 max-w-md text-sm leading-6 text-[hsl(var(--primary-foreground)/.66)]">Share your route, cargo context and service need. Requests are reviewed by our team and answered by email. No quote is generated automatically.</p>
                  <button type="button" onClick={() => openEnquiry()} className="button-cta-outline mt-7" data-testid="button-open-contact">
                    Start a logistics enquiry <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </Layout>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <WouterRoute path="/" component={Home} />
        <WouterRoute path="/shop" component={Shop} />
        <WouterRoute path="/services" component={Services} />
        <WouterRoute path="/products">{() => <Redirect to="/shop" />}</WouterRoute>
        <WouterRoute path="/product/:id">{() => <Redirect to="/shop" />}</WouterRoute>
        <WouterRoute path="/cart">{() => <Redirect to="/shop" />}</WouterRoute>
        <WouterRoute path="/checkout">{() => <Redirect to="/shop" />}</WouterRoute>
        <WouterRoute path="/orders" component={Orders} />
        <WouterRoute path="/seller" component={Seller} />
        <WouterRoute path="/visa" component={Visa} />
        <WouterRoute path="/visa/request" component={VisaRequest} />
        <WouterRoute path="/appointments" component={Appointments} />
        <WouterRoute path="/dashboard" component={() => <Dashboard />} />
        <WouterRoute path="/dashboard/:area">{(p) => <Dashboard area={p.area} />}</WouterRoute>
        <WouterRoute component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;