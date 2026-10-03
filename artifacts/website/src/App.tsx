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
import {
  Route as WouterRoute,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

// --- FRAMER MOTION IMPORTS ---
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// --- FORMSPREE REACT IMPORTS ---
import { useForm, ValidationError } from '@formspree/react';

const queryClient = new QueryClient();

// --- ANIMATION HELPERS ---

/** Standard fade-up entrance */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  },
};

/** Stagger container for lists */
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // Delay between each child item
      delayChildren: 0.1,
    },
  },
};

/** Item inside a stagger container */
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

/** Hook to respect user's reduced motion preference */
function useSafeVariants(variants: Variants): Variants {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  
  return variants;
}

// --- DATA CONSTANTS ---

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

// --- COMPONENTS ---

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="brand-mark" data-testid="brand-mark">
      <span className={`brand-symbol ${light ? 'brand-symbol-light' : ''}`} aria-hidden="true">
        <span className="brand-symbol-diamond" />
        <span className="brand-symbol-dot" />
      </span>
      <span className={`brand-name ${light ? 'brand-name-light' : ''}`}>
        WORSTART<span> SHIPPING</span>
      </span>
    </span>
  );
}

function NetworkGraphic() {
  const positions = [
    'left-[12%] top-[38%]',
    'left-[49%] top-[16%]',
    'right-[8%] top-[28%]',
    'left-[30%] bottom-[25%]',
    'right-[20%] bottom-[12%]',
    'left-[10%] bottom-[8%]',
  ];

  // Safe variants for nodes
  const nodeVariants = useSafeVariants(staggerItem);

  return (
    <div
      className="network-graphic relative mx-auto aspect-square w-full max-w-[480px]"
      role="img"
      aria-label="Abstract network of WORSTART SHIPPING lanes"
    >
      {/* Background rings remain static or simple CSS anim if desired, keeping them clean here */}
      <div className="network-ring network-ring-outer absolute inset-[7%] rounded-full" />
      <div className="network-ring network-ring-mid absolute inset-[21%] rounded-full" />
      <div className="network-ring network-ring-inner absolute inset-[36%] rounded-full" />
      <div className="hero-orbit absolute inset-[3%] rounded-[50%]" />
      <div className="hero-orbit-slow absolute inset-[14%] rounded-[50%]" />
      
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <path d="M93 335C138 248 161 134 263 120C336 110 356 184 421 173" stroke="hsl(var(--accent) / .8)" strokeWidth="1.5" className="route-dash" />
        <path d="M78 193C177 197 211 311 308 358C358 382 385 315 433 277" stroke="hsl(var(--foreground) / .38)" strokeWidth="1.2" className="route-dash" />
        <path d="M145 419C181 355 208 276 179 197C165 157 133 141 109 100" stroke="hsl(var(--foreground) / .25)" strokeWidth="1.2" className="route-dash" />
        <path d="M261 120C281 207 326 254 421 173" stroke="hsl(var(--accent) / .35)" strokeWidth="1" />
        <path d="M179 197C245 189 278 195 308 358" stroke="hsl(var(--foreground) / .22)" strokeWidth="1" />
      </svg>

      {/* Animated Nodes Container */}
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="contents" /* Keeps layout intact */
      >
        {markets.map((market, index) => (
          <motion.div
            key={market.code}
            variants={nodeVariants}
            className={`network-node absolute ${positions[index]} group`}
            data-testid={`market-node-${market.code}`}
          >
            <div className="network-node-dot relative flex items-center justify-center rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] font-mono-ui font-medium text-[hsl(var(--foreground))] shadow-[0_0_0_7px_hsl(var(--background)/.72)] transition-transform duration-300 group-hover:scale-110">
              {market.code}
              <span className="absolute inset-1.5 rounded-full border border-[hsl(var(--accent)/.25)]" />
            </div>
            <span className="market-name absolute left-1/2 top-full mt-2 -translate-x-1/2 font-mono-ui uppercase text-[hsl(var(--muted-foreground))]">
              {market.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div className="network-core absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[hsl(var(--primary))] text-center text-[hsl(var(--primary-foreground))] shadow-[0_16px_38px_rgba(30,48,68,.2)]">
        <span className="font-display text-2xl font-bold leading-none">W</span>
        <span className="mt-2 font-mono-ui text-[0.53rem] uppercase tracking-[.14em] text-[hsl(var(--primary-foreground)/.7)]">shipping link</span>
      </div>
      <div className="network-status absolute flex items-center gap-2 bg-[hsl(var(--accent))] font-mono-ui uppercase text-[hsl(var(--accent-foreground))]">
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-foreground))]" />
        Illustrative network
      </div>
    </div>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  // Initialize Formspree hook with your unique ID
  const [state, handleSubmit] = useForm("mljdoanv");

  // If submission is successful, show a success screen inside the modal
  if (state.succeeded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--primary)/.78)] p-4 backdrop-blur-sm">
        <div className="modal-in relative w-full max-w-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-9 shadow-2xl text-center">
          <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4" aria-label="Close confirmation">
            <X className="h-5 w-5" />
          </button>
          
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent)/.14)] text-[hsl(var(--accent))]">
            <Check className="h-6 w-6" />
          </div>
          
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--foreground))]">Enquiry Received.</h2>
          <p className="mt-4 max-w-md mx-auto text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            Thank you for contacting WORSTART SHIPPING. We have received your route details and will review them shortly.
          </p>
          
          <button type="button" onClick={onClose} className="button-primary mt-8 w-full">
            Close Window
          </button>
        </div>
      </div>
    );
  }

  // Normal Form View
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--primary)/.78)] p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="modal-in relative w-full max-w-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-2xl sm:p-9" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        
        <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4" aria-label="Close logistics enquiry">
          <X className="h-5 w-5" />
        </button>

        <p className="eyebrow">Start a logistics enquiry</p>
        <h2 id="contact-modal-title" className="mt-4 max-w-sm font-display text-3xl font-bold leading-[1.06] text-[hsl(var(--foreground))]">Tell us about your move.</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          Share the origin, destination, and cargo context so we can prepare the right route strategy for you.
        </p>

        {/* FORM STARTS HERE */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          
          <label className="block">
            <span className="field-label">Your Name</span>
            <input required type="text" name="name" className="field-input" placeholder="Full Name" />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </label>
          
          <label className="block">
            <span className="field-label">Business Email</span>
            <input required type="email" name="email" className="field-input" placeholder="you@company.com" />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </label>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Origin Country</span>
              <input required type="text" name="origin" className="field-input" placeholder="e.g. Algeria" />
              <ValidationError prefix="Origin" field="origin" errors={state.errors} />
            </label>
            
            <label className="block">
              <span className="field-label">Destination Country</span>
              <input required type="text" name="destination" className="field-input" placeholder="e.g. Germany" />
              <ValidationError prefix="Destination" field="destination" errors={state.errors} />
            </label>
          </div>

          <label className="block">
            <span className="field-label">Cargo & Service Details</span>
            <textarea required rows={3} name="message" className="field-input resize-none" placeholder="What are you moving? Freight, fulfillment, customs docs?" />
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </label>

          <button 
            type="submit" 
            disabled={state.submitting} 
            className="button-primary mt-3 flex w-full justify-between"
          >
            {state.submitting ? 'Sending...' : 'Prepare Enquiry'}
            {!state.submitting && <ArrowUpRight className="h-4 w-4" />}
          </button>
          
          <p className="font-mono-ui text-[0.58rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
            Secure submission via Formspree. No spam.
          </p>
        </form>
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeCapability, setActiveCapability] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  // SEO Meta Tags
  useEffect(() => {
    document.title = 'WORSTART SHIPPING';
    const description = 'WORSTART SHIPPING helps businesses think clearly about freight, fulfillment, documentation and shipment movement across international routes.';
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
    setOg('og:title', 'WORSTART SHIPPING');
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
    setNameMeta('twitter:title', 'WORSTART SHIPPING');
    setNameMeta('twitter:description', description);
  }, []);

  // Header Scroll Effect
  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile Menu Logic
  useEffect(() => {
    if (!menuOpen && !contactOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (menuOpen) closeMenu();
      if (contactOpen) setContactOpen(false);
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
    setContactOpen(true);
  };

  // Hero Text Splitting for Word Reveal
  const heroTitleWords = ["Goods", "move.", "We", "make", "the", "route", "clear."];
  const safeHeroVariants = useSafeVariants(fadeUp);

  return (
    <div className="site-shell grain">
      <header className={`site-header ${headerScrolled ? 'site-header-scrolled' : ''}`}>
        <div className="container-wide header-bar flex h-[76px] items-center justify-between">
              <a href="#top" aria-label="WORSTART SHIPPING home" data-testid="link-home">
            <BrandMark />
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            <a href="#top" className="nav-link" data-testid="link-overview">Overview</a>
            <a href="#capabilities" className="nav-link" data-testid="link-capabilities">Services</a>
            <a href="#markets" className="nav-link" data-testid="link-markets">Network</a>
            <a href="#ecosystem" className="nav-link" data-testid="link-ecosystem">Ecosystem</a>
            <a href="#approach" className="nav-link" data-testid="link-approach">How it works</a>
            <a href="#contact" className="button-nav group" data-testid="link-header-contact">
              Start a logistics enquiry <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
            </a>
          </nav>
          <button ref={menuButtonRef} type="button" className="menu-toggle inline-flex items-center justify-center md:hidden" onClick={toggleMenu} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} data-testid="button-mobile-menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Panel Animation */}
        <motion.div 
          initial={false}
          animate={{ 
            height: menuOpen ? 'auto' : 0,
            opacity: menuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`overflow-hidden mobile-panel ${menuOpen ? 'mobile-panel-open' : ''}`} 
          aria-hidden={!menuOpen}
        >
          <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
            <div className="mobile-navigation-intro">
              <span className="eyebrow">WORSTART / shipping</span>
              <span className="font-mono-ui text-[0.62rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Logistics network</span>
            </div>
            <a ref={firstMenuItemRef} href="#top" onClick={closeMenu} className="mobile-nav-link" data-testid="mobile-link-overview">
              <span><small>01</small>Overview</span><ArrowUpRight />
            </a>
            <a href="#capabilities" onClick={closeMenu} className="mobile-nav-link" data-testid="mobile-link-capabilities">
              <span><small>02</small>Services</span><ArrowUpRight />
            </a>
            <a href="#markets" onClick={closeMenu} className="mobile-nav-link" data-testid="mobile-link-markets">
              <span><small>03</small>Network</span><ArrowUpRight />
            </a>
            <a href="#ecosystem" onClick={closeMenu} className="mobile-nav-link" data-testid="mobile-link-ecosystem">
              <span><small>04</small>Ecosystem</span><ArrowUpRight />
            </a>
            <a href="#approach" onClick={closeMenu} className="mobile-nav-link" data-testid="mobile-link-approach">
              <span><small>05</small>How it works</span><ArrowUpRight />
            </a>
            <button type="button" onClick={openContactFromMenu} className="mobile-nav-cta" data-testid="mobile-link-contact">
              <span>Start a logistics enquiry</span><ArrowUpRight />
            </button>
            <div className="mobile-navigation-footer">
              <span>Six lanes</span>
              <span className="h-px flex-1 bg-[hsl(var(--border))]" />
              <span>One route forward</span>
            </div>
          </nav>
        </motion.div>
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="page-grid hero-section relative flex items-center overflow-hidden border-b border-[hsl(var(--border))]">
          <div className="container-wide relative z-10 grid w-full items-center gap-8 lg:grid-cols-[1.03fr_.97fr] lg:gap-5">
            
            <div className="hero-copy max-w-[680px]">
              {/* Eyebrow Fade Up */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={safeHeroVariants}
                className="flex items-center gap-3"
              >
                <span className="h-px w-10 bg-[hsl(var(--accent))]" />
                  <p className="eyebrow">International freight &amp; logistics</p>
              </motion.div>

              {/* H1 Word-by-Word Reveal */}
              <motion.h1 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
                className="mt-7 max-w-[14ch] text-balance font-display font-bold leading-[.89] tracking-[-.065em] text-[hsl(var(--foreground))]"
              >
                 {heroTitleWords.map((word, i) => (
                   <motion.span 
                     key={i} 
                     variants={staggerItem}
                     className={word.includes("route") || word.includes("clear") ? "inline-block text-[hsl(var(--accent))]" : "inline-block"}
                   >
                     {word}&nbsp;
                   </motion.span>
                 ))}
              </motion.h1>

              {/* Subtitle Fade Up */}
              <motion.p 
                initial="hidden" 
                animate="visible" 
                variants={safeHeroVariants}
                transition={{ delay: 0.4 }}
                className="mt-7 max-w-[510px] text-[1.02rem] leading-7 text-[hsl(var(--muted-foreground))]"
              >
                  WORSTART SHIPPING brings route clarity to freight, fulfillment, documentation and shipment visibility across the markets your business depends on.
              </motion.p>

              {/* Buttons Fade Up */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={safeHeroVariants}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
              >
                <a href="#contact" className="button-primary group" data-testid="link-hero-contact">
                   Start a logistics enquiry
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a href="#markets" className="link-arrow inline-flex min-h-12 items-center gap-3 text-sm font-semibold text-[hsl(var(--foreground))]" data-testid="link-hero-markets">
                   Explore our lanes <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))]" />
                </a>
              </motion.div>
            </div>

            {/* Graphic Fade In */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-graphic-wrap flex w-full justify-center lg:justify-end"
            >
              <NetworkGraphic />
            </motion.div>
          </div>
          
          <div className="absolute bottom-5 left-5 hidden items-center gap-3 md:flex">
            <span className="font-mono-ui text-[0.57rem] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Scroll to navigate</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-[hsl(var(--accent))]" />
          </div>
          <span className="absolute right-5 top-1/2 hidden -rotate-90 font-mono-ui text-[0.57rem] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))] lg:block">WS / 001</span>
        </section>

        {/* ECOSYSTEM STRIP */}
        <section className="ecosystem-strip border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
          <div className="container-wide flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-8">
            <span className="font-mono-ui text-[0.6rem] uppercase tracking-[.16em] text-[hsl(var(--accent))]">Connected by WORSTART</span>
            <div className="ecosystem-marquee" aria-label="WORSTART ecosystem labels">
              <div className="ecosystem-marquee-track">
                <span>Bank Online</span><i>·</i><span>DZ Seller</span><i>·</i><span>Car Leasing &amp; Booking</span><i>·</i><span>Future Maritime</span>
                <span aria-hidden="true">Bank Online</span><i aria-hidden="true">·</i><span aria-hidden="true">DZ Seller</span><i aria-hidden="true">·</i><span aria-hidden="true">Car Leasing &amp; Booking</span><i aria-hidden="true">·</i><span aria-hidden="true">Future Maritime</span>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section id="capabilities" className="bg-[hsl(var(--background))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="section-heading grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <p className="eyebrow">Services / built around the handoff</p>
                <h2 className="mt-5 max-w-md font-display text-4xl font-bold leading-[1.02] tracking-[-.04em] text-[hsl(var(--foreground))] md:text-5xl">The work between origin and arrival.</h2>
              </div>
              <div className="max-w-xl lg:pt-10">
                <p className="text-lg leading-8 text-[hsl(var(--muted-foreground))]">A logistics route is more than distance. It is the information, people, documents and next handoffs that make movement easier to understand.</p>
              </div>
            </div>
            
            {/* Staggered Grid */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="capability-grid mt-14 md:mt-16"
            >
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                const expanded = activeCapability === capability.number;
                return (
                  <motion.article 
                    key={capability.number} 
                    variants={staggerItem}
                    className={`service-card ${expanded ? 'service-card-expanded' : ''}`} 
                    data-testid={`card-capability-${capability.number}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-xs text-[hsl(var(--accent))]" data-testid={`text-capability-number-${capability.number}`}>{capability.number}</span>
                      <span className="service-icon flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] text-[hsl(var(--foreground)/.65)]">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 font-display text-2xl font-bold tracking-[-.03em] text-[hsl(var(--foreground))]" data-testid={`text-capability-title-${capability.number}`}>{capability.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{capability.body}</p>
                    <ul className="service-bullets mt-6 space-y-3">
                      {capability.bullets.map((bullet) => <li key={bullet}><span />{bullet}</li>)}
                    </ul>
                    <button type="button" className="service-detail-toggle mt-7" onClick={() => setActiveCapability(expanded ? null : capability.number)} aria-expanded={expanded}>
                      {expanded ? 'Close detail' : 'Learn more'} <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    {expanded && <p className="service-detail mt-4 border-t border-[hsl(var(--border))] pt-4 text-xs leading-5 text-[hsl(var(--muted-foreground))]">This is an intended operating model. Specific partner, carrier and service details are confirmed for each movement.</p>}
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* MARKETS SECTION */}
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
            
            {/* Horizontal Scroll Rail with Stagger */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="markets-rail mt-14 md:mt-16" 
              tabIndex={0} 
              aria-label="WORSTART market network"
            >
              {markets.map((market, index) => (
                <motion.article 
                  key={market.code} 
                  variants={staggerItem}
                  className="market-card group relative min-h-[190px] bg-[hsl(var(--primary))] p-5 md:min-h-[220px] md:p-7" 
                  data-testid={`card-market-${market.code}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono-ui text-xs text-[hsl(var(--accent))]">{String(index + 1).padStart(2, '0')}</span>
                    <ArrowUpRight className="h-4 w-4 text-[hsl(var(--primary-foreground)/.38)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <div className="mt-8">
                    <h3 className="market-title font-display text-2xl font-bold tracking-[-.035em]">{market.name}</h3>
                    <p className="mt-2 font-mono-ui text-[0.58rem] uppercase tracking-[.13em] text-[hsl(var(--primary-foreground)/.48)]">{market.note}</p>
                    <p className="market-route mt-5 max-w-[18rem] text-sm leading-6 text-[hsl(var(--primary-foreground)/.64)]">{market.route}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
              <div className="mt-7 flex items-center justify-between gap-3 font-mono-ui text-[0.62rem] uppercase tracking-[.13em] text-[hsl(var(--primary-foreground)/.48)]">
              <span className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-[hsl(var(--accent))]" /> Route descriptions, not performance claims</span>
              <span className="hidden sm:inline">Scroll / drag to explore</span>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM MAP SECTION */}
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
            
            {/* Ecosystem Cards Stagger */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="ecosystem-map mt-14"
            >
              <div className="ecosystem-center">
                <span className="font-mono-ui text-[0.58rem] uppercase tracking-[.15em] text-[hsl(var(--accent))]">Movement layer</span>
                <strong className="mt-3 font-display text-3xl tracking-[-.05em]">WORSTART<br />SHIPPING</strong>
                <span className="mt-4 max-w-[13rem] text-xs leading-5 text-[hsl(var(--primary-foreground)/.62)]">Route, fulfillment and handoff context between ecosystem services.</span>
              </div>
              <div className="ecosystem-connectors" aria-hidden="true"><span /><span /><span /><span /></div>
              {ecosystemLayers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <motion.article 
                    key={layer.number} 
                    variants={staggerItem}
                    className={`ecosystem-card ecosystem-card-${layer.number}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-xs text-[hsl(var(--accent))]">{layer.number}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground)/.65)]">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-8 font-mono-ui text-[0.58rem] uppercase tracking-[.13em] text-[hsl(var(--accent))]">{layer.label}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-[-.035em] text-[hsl(var(--foreground))]">{layer.name}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{layer.body}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* APPROACH / PROCESS TIMELINE */}
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
                  
                  {/* Timeline Steps Stagger */}
                  <motion.div 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="contents"
                  >
                    {processSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <motion.article 
                          key={step.number} 
                          variants={staggerItem}
                          className="process-step reveal-on-scroll"
                        >
                          <div className="process-step-marker">
                            <span>{step.number}</span>
                          </div>
                          <div className="process-step-copy">
                            <Icon className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} aria-hidden="true" />
                            <h3 className="mt-4 font-display text-xl font-bold text-[hsl(var(--foreground))]">{step.title}</h3>
                            <p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{step.body}</p>
                          </div>
                        </motion.article>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPLES GRID */}
        <section className="bg-[hsl(var(--primary))] py-20 text-[hsl(var(--primary-foreground))] md:py-24">
          <div className="container-wide">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Operating principles</p>
                <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[.98] tracking-[-.05em] md:text-6xl">The standards behind a clearer move.</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[hsl(var(--primary-foreground)/.62)]">Principles, not performance claims. The details of each movement still need to be confirmed.</p>
            </div>
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="principles-grid mt-14 border-t border-[hsl(var(--primary-foreground)/.18)]"
            >
              {principles.map((principle) => (
                <motion.article 
                  key={principle.number} 
                  variants={staggerItem}
                  className="principle-card"
                >
                  <span className="font-mono-ui text-xs text-[hsl(var(--accent))]">{principle.number}</span>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-[-.03em]">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[hsl(var(--primary-foreground)/.62)]">{principle.body}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* COORDINATION VISUAL */}
        <section className="bg-[hsl(var(--background))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-24">
              
              {/* Visual Side Fade In */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="coordinate-visual page-grid relative min-h-[360px] overflow-hidden border border-[hsl(var(--border))] p-7 md:min-h-[420px] md:p-10"
              >
                <div className="coordinate-orbit coordinate-orbit-one" />
                <div className="coordinate-orbit coordinate-orbit-two" />
                <div className="coordinate-route route-route-one" />
                <div className="coordinate-route route-route-two" />
                <div className="coordinate-center">
                  <span className="font-mono-ui text-[0.55rem] uppercase tracking-[.15em]">W / coordination</span>
                  <strong className="mt-3 font-display text-3xl">Next<br />handoff</strong>
                </div>
                <span className="coordinate-chip coordinate-chip-origin">Origin context</span>
                <span className="coordinate-chip coordinate-chip-docs">Documents</span>
                <span className="coordinate-chip coordinate-chip-destination">Destination</span>
                <span className="absolute bottom-6 left-7 font-mono-ui text-[0.58rem] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))] md:left-10">Illustrative coordination view</span>
              </motion.div>

              {/* Content Side Stagger */}
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.p variants={staggerItem} className="eyebrow">What we coordinate</motion.p>
                <motion.h2 variants={staggerItem} className="mt-5 max-w-xl font-display text-4xl font-bold leading-[.98] tracking-[-.05em] text-[hsl(var(--foreground))] md:text-6xl">Less ambiguity between one move and the next.</motion.h2>
                <motion.p variants={staggerItem} className="mt-7 max-w-xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">The logistics layer is where cargo context, documents, service need and partner confirmation meet. We keep that conversation structured.</motion.p>
                
                <motion.div variants={staggerItem} className="coordination-list mt-10 border-t border-[hsl(var(--border))]">
                  {coordinationItems.map((item) => (
                    <div key={item} className="coordination-item"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />{item}<ArrowUpRight className="ml-auto h-4 w-4 text-[hsl(var(--accent))]" /></div>
                  ))}
                </motion.div>
                
                <motion.a 
                  variants={staggerItem}
                  href="#contact" 
                  className="button-secondary mt-8"
                >
                  Start with route context <ArrowUpRight className="h-4 w-4" />
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SHIPMENT PANEL */}
        <section className="bg-[hsl(var(--secondary))] py-20 md:py-28 lg:py-32">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:gap-24">
              <div>
                <p className="eyebrow">Example shipment view / non-live</p>
                <h2 className="mt-5 max-w-lg font-display text-4xl font-bold leading-[.98] tracking-[-.05em] text-[hsl(var(--foreground))] md:text-6xl">A clearer view of what matters next.</h2>
                <p className="mt-7 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">An illustrative workflow panel showing the information a route conversation should keep in view. It is not connected to a shipment or backend.</p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="shipment-panel rounded-[1.75rem] bg-[hsl(var(--background))] p-5 shadow-[0_20px_70px_rgba(30,48,68,.1)] md:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-5">
                  <div><span className="field-label">Illustrative workflow</span><h3 className="mt-2 font-display text-2xl font-bold text-[hsl(var(--foreground))]">Route context / sample</h3></div>
                  <span className="workflow-badge"><span />Not live</span>
                </div>
                <div className="shipment-route-bar mt-6">
                  <div><span className="field-label">Origin</span><strong>Algeria</strong></div>
                  <div className="shipment-route-line"><span /><span /><span /></div>
                  <div className="text-right"><span className="field-label">Destination</span><strong>European Union</strong></div>
                </div>
                <div className="shipment-detail-grid mt-8">
                  <div><span className="field-label">Cargo / service need</span><strong>Example cargo context</strong></div>
                  <div><span className="field-label">Current stage</span><strong>Route brief</strong></div>
                  <div><span className="field-label">Documents</span><strong><Check className="mr-2 inline h-4 w-4 text-[hsl(var(--accent))]" />Information to review</strong></div>
                  <div><span className="field-label">Next handoff</span><strong>Confirmation required</strong></div>
                </div>
                <div className="mt-8 border-t border-[hsl(var(--border))] pt-5 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Sample content only. A real movement would be shaped around confirmed cargo, documents, route and partner details.</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FUTURE DIRECTION */}
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

        {/* CONTACT CTA */}
        <section id="contact" className="bg-[hsl(var(--background))] px-0 py-20 md:py-28">
          <div className="container-wide">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="contact-panel relative overflow-hidden rounded-[2rem] bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))] md:p-12 lg:p-16"
            >
              <div className="cta-orbit cta-orbit-large absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full md:right-[8%]" />
              <div className="cta-orbit cta-orbit-small absolute -right-2 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full md:right-[12%]" />
              <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center lg:gap-20">
                <div>
                  <p className="eyebrow">Start a logistics enquiry</p>
                  <h2 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[.93] tracking-[-.06em] md:text-7xl">Move goods<br /><span className="text-[hsl(var(--accent))]">with clarity.</span></h2>
                  <p className="mt-7 max-w-md text-sm leading-6 text-[hsl(var(--primary-foreground)/.66)]">Share your route, cargo context and service need. This presentation flow shows how the conversation starts; details are not sent yet.</p>
                  <button type="button" onClick={() => setContactOpen(true)} className="button-cta-outline mt-7" data-testid="button-open-contact">
                    Start a logistics enquiry <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="contact-route-visual" aria-hidden="true">
                  <div className="contact-route-grid" />
                  <div className="contact-route-line contact-route-line-one" />
                  <div className="contact-route-line contact-route-line-two" />
                  <span className="contact-route-node contact-route-node-one">DZ</span>
                  <span className="contact-route-node contact-route-node-two">EU</span>
                  <span className="contact-route-node contact-route-node-three">CN</span>
                  <div className="contact-route-core"><span>W</span><small>next move</small></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-[hsl(var(--primary))] py-12 text-[hsl(var(--primary-foreground))]">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-10 border-b border-[hsl(var(--primary-foreground)/.18)] pb-10 md:flex-row md:items-start">
            <div>
              <a href="#top" aria-label="Back to WORSTART SHIPPING home" data-testid="link-footer-home"><BrandMark light /></a>
              <p className="mt-5 max-w-xs text-sm leading-6 text-[hsl(var(--primary-foreground)/.55)]">Route clarity, freight coordination and visibility between confirmed handoffs.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-14 gap-y-4 sm:grid-cols-4">
              <a href="#top" className="footer-link" data-testid="link-footer-overview">Overview</a>
              <a href="#capabilities" className="footer-link" data-testid="link-footer-capabilities">Services</a>
              <a href="#markets" className="footer-link" data-testid="link-footer-markets">Network</a>
              <a href="#ecosystem" className="footer-link" data-testid="link-footer-ecosystem">Ecosystem</a>
              <a href="#approach" className="footer-link" data-testid="link-footer-approach">How it works</a>
              <a href="#contact" className="footer-link" data-testid="link-footer-contact">Enquiry</a>
              <a href="#legal-notice" className="footer-link" data-testid="link-footer-privacy">Privacy</a>
              <a href="#legal-notice" className="footer-link" data-testid="link-footer-terms">Terms</a>
            </div>
          </div>
          <div className="footer-ecosystem flex flex-col gap-3 border-b border-[hsl(var(--primary-foreground)/.18)] py-6 font-mono-ui text-[0.58rem] uppercase tracking-[.12em] text-[hsl(var(--primary-foreground)/.42)] sm:flex-row sm:items-center sm:gap-5">
            <span className="text-[hsl(var(--accent))]">Ecosystem labels</span>
            <span>Bank Online</span><i>·</i><span>DZ Seller</span><i>·</i><span>Car Leasing &amp; Booking</span><i>·</i><span>Future Maritime</span>
          </div>
          <p id="legal-notice" className="pt-6 text-xs leading-5 text-[hsl(var(--primary-foreground)/.38)]">Privacy and terms details are to be confirmed before launch.</p>
          <div className="flex flex-col justify-between gap-3 pt-6 font-mono-ui text-[0.57rem] uppercase tracking-[.12em] text-[hsl(var(--primary-foreground)/.38)] sm:flex-row">
            <span>WORSTART SHIPPING</span>
            <span>Operational details to be confirmed</span>
            <span>Move goods with clarity</span>
          </div>
        </div>
      </footer>
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <WouterRoute path="/" component={Home} />
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
