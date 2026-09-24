import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="site-shell grain flex min-h-screen items-center justify-center px-5 py-12">
      <main className="w-full max-w-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-7 sm:p-12">
        <div className="flex items-center gap-3">
          <span className="brand-symbol" aria-hidden="true">
            <span className="brand-symbol-diamond" />
            <span className="brand-symbol-dot" />
          </span>
          <span className="brand-name">WORSTART<span> SHIPPING</span></span>
        </div>
        <div className="mt-16 flex items-start gap-4">
          <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-[hsl(var(--accent))]" />
          <div>
            <p className="eyebrow">Route not found</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-none tracking-[-.05em] text-[hsl(var(--foreground))] sm:text-5xl">This page is not on the route.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">The address may have changed, or the page may not be available yet.</p>
            <a href="/" className="button-primary mt-8 inline-flex">
              <ArrowLeft className="h-4 w-4" /> Return home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
