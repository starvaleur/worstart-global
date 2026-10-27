import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowUpRight, Menu, ShoppingCart, X } from 'lucide-react';
import { openEnquiry } from '@/lib/config';
import { useCart } from '@/lib/shop/cart';

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="brand-mark" data-testid="brand-mark">
      <span className={`brand-symbol ${light ? 'brand-symbol-light' : ''}`} aria-hidden="true"><span className="brand-symbol-diamond" /><span className="brand-symbol-dot" /></span>
      <span className={`brand-name ${light ? 'brand-name-light' : ''}`}>WORSTART<span> SHIPPING</span></span>
    </span>
  );
}

const desktop = [['Overview', '/'], ['Services', '/#capabilities'], ['Import & Export', '/#import-export'], ['Ecosystem', '/#ecosystem'], ['Network', '/#markets'], ['How it works', '/#approach']];
const mobile = [...desktop, ['Shop', '/shop'], ['Visa services', '/visa'], ['Appointments', '/appointments'], ['Dashboard', '/dashboard']];
const footerCols: [string, [string, string][]][] = [
  ['Logistics', [['Import & export', '/#import-export'], ['Cars', '/#cars'], ['Freight & fulfillment', '/#logistics'], ['Tracking', '/#tracking']]],
  ['Commerce', [['Shop (demo)', '/shop'], ['Seller', '/seller'], ['Payments', '/#payments'], ['Orders', '/orders']]],
  ['Services', [['Visa assistance', '/visa'], ['Appointments', '/appointments'], ['Dashboard', '/dashboard']]],
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loc] = useLocation();
  const btn = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLAnchorElement>(null);
  const { count } = useCart();

  useEffect(() => { setOpen(false); if (!window.location.hash) window.scrollTo(0, 0); }, [loc]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 28); on();
    window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(false), btn.current?.focus());
    document.addEventListener('keydown', k); const f = requestAnimationFrame(() => first.current?.focus());
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', k); cancelAnimationFrame(f); };
  }, [open]);

  return (
    <div className="site-shell grain">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-[hsl(var(--accent))] focus:p-3">Skip to content</a>
      <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
        <div className="container-wide header-bar flex h-[76px] items-center justify-between">
          <a href="/" aria-label="WORSTART SHIPPING home" data-testid="link-home"><BrandMark /></a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
            {desktop.map(([l, h]) => <a key={l} href={h} className="nav-link">{l}</a>)}
            <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]" aria-label={`Cart, ${count} items`} data-testid="link-cart"><ShoppingCart className="h-4 w-4" />{count > 0 && <span className="absolute right-0 top-0 rounded-full bg-[hsl(var(--accent))] px-1.5 text-[0.55rem]">{count}</span>}</Link>
            <button type="button" className="button-nav group" onClick={() => openEnquiry()} data-testid="link-header-contact">Start a logistics enquiry <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /></button>
          </nav>
          <button ref={btn} type="button" className="menu-toggle inline-flex items-center justify-center lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} data-testid="button-mobile-menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>
      <div className={`mobile-panel ${open ? 'mobile-panel-open' : ''}`} aria-hidden={!open}>
          <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
            <div className="mobile-navigation-intro"><span className="eyebrow">WORSTART / global</span><span className="font-mono-ui text-[0.62rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Menu</span></div>
            {mobile.map(([l, h], i) => (
              <a key={l} ref={i === 0 ? first : undefined} href={h} onClick={() => setOpen(false)} className="mobile-nav-link" tabIndex={open ? 0 : -1}>
                <span><small>{String(i + 1).padStart(2, '0')}</small>{l}</span><ArrowUpRight />
              </a>
            ))}
            <button type="button" className="mobile-nav-cta" tabIndex={open ? 0 : -1} onClick={() => { setOpen(false); openEnquiry(); }} data-testid="mobile-link-contact"><span>Start a logistics enquiry</span><ArrowUpRight /></button>
            <Link href="/cart" className="mt-4 font-mono-ui text-xs uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]" tabIndex={open ? 0 : -1}>Cart ({count})</Link>
          </nav>
      </div>

      <main id="main">{children}</main>

      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--primary))] py-14">
        <div className="container-wide">
          <div className="grid gap-10 border-b border-[hsl(var(--border))] pb-10 md:grid-cols-[1.2fr_2fr]">
            <div>
              <BrandMark light />
              <p className="mt-5 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">WORSTART GLOBAL — logistics, commerce, payments and visa assistance, coordinated across international routes.</p>
              <button type="button" className="button-secondary mt-6" onClick={() => openEnquiry()}>Start a logistics enquiry <ArrowUpRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {footerCols.map(([t, links]) => (
                <div key={t}><p className="eyebrow">{t}</p><ul className="mt-4 space-y-3">{links.map(([l, h]) => <li key={l}><a href={h} className="footer-link">{l}</a></li>)}</ul></div>
              ))}
            </div>
          </div>
          <p className="pt-6 text-xs leading-5 text-[hsl(var(--muted-foreground))]">WORSTART GLOBAL operates through a U.S. LLC. WORSTART is not a government authority, does not guarantee visa approval or customs outcomes, and is not a bank. Privacy and terms details are to be confirmed before launch.</p>
        </div>
      </footer>
    </div>
  );
}
