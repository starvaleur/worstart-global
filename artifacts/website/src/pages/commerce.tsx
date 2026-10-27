import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Layout } from '@/components/site/layout';
import { Badge, Button, Card, DataTable, EmptyState, ErrorState, LoadingState, SectionHeader, Timeline } from '@/components/site/ds';
import { cart, useCart } from '@/lib/shop/cart';
import { money } from '@/lib/shop/source';
import { api } from '@/lib/api';
import { openEnquiry } from '@/lib/config';

export function Cart() {
  const { lines, totalMinor, currency } = useCart();
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow="Cart" title="Your cart." />
      <div className="mt-10">
        {lines.length === 0 ? <EmptyState title="Your cart is empty" body="Add products from the shop to start an order." action={<Link href="/shop" className="button-primary">Browse the shop</Link>} /> : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ul className="space-y-3">{lines.map((l) => (
              <li key={l.id} className="card-ds flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1"><p className="font-semibold">{l.name}</p>{l.demo && <Badge tone="warn">Demo</Badge>}<p className="mt-1 font-mono-ui text-xs text-[hsl(var(--muted-foreground))]">{money(l.priceMinor, l.currency)}</p></div>
                <div className="flex items-center gap-1"><button type="button" className="icon-button" aria-label={`Decrease ${l.name}`} onClick={() => cart.setQty(l.id, l.qty - 1)}><Minus className="h-4 w-4" /></button><span className="w-8 text-center" aria-live="polite">{l.qty}</span><button type="button" className="icon-button" aria-label={`Increase ${l.name}`} onClick={() => cart.setQty(l.id, l.qty + 1)}><Plus className="h-4 w-4" /></button></div>
                <button type="button" className="icon-button" aria-label={`Remove ${l.name}`} onClick={() => cart.remove(l.id)}><Trash2 className="h-4 w-4" /></button>
              </li>))}</ul>
            <Card><p className="eyebrow">Summary</p><p className="mt-4 flex justify-between text-sm"><span>Subtotal</span><span className="font-mono-ui">{money(totalMinor, currency)}</span></p><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Shipping and taxes are confirmed at checkout.</p><Link href="/checkout" className="button-primary mt-6 w-full" data-testid="link-checkout">Continue to checkout</Link></Card>
          </div>)}
      </div>
    </div></Layout>
  );
}

interface ProviderInfo { id: string; label: string; configured: boolean }
type Pay = { s: 'idle' } | { s: 'working' } | { s: 'failed'; msg: string };

export function Checkout() {
  const { lines, totalMinor, currency } = useCart();
  const [providers, setProviders] = useState<ProviderInfo[] | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [choice, setChoice] = useState('');
  const [email, setEmail] = useState('');
  const [pay, setPay] = useState<Pay>({ s: 'idle' });
  const hasDemo = lines.some((l) => l.demo);

  useEffect(() => { api<{ providers: ProviderInfo[] }>('/payments/providers').then((r) => r.ok ? setProviders(r.data.providers) : setLoadErr(r.error)); }, []);

  async function submit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setPay({ s: 'failed', msg: 'Enter a valid email address.' }); return; }
    setPay({ s: 'working' });
    const r = await api<{ redirectUrl?: string }>('/payments/checkout', { method: 'POST', body: JSON.stringify({ provider: choice, reference: `WS-${Date.now()}`, amountMinor: totalMinor, currency, customerEmail: email }) });
    if (r.ok && r.data.redirectUrl) { window.location.href = r.data.redirectUrl; return; }
    setPay({ s: 'failed', msg: r.ok ? 'The provider did not return a payment page.' : r.error });
  }

  if (lines.length === 0) return <Layout><div className="page-shell container-wide"><EmptyState title="Nothing to check out" body="Your cart is empty." action={<Link href="/shop" className="button-primary">Browse the shop</Link>} /></div></Layout>;
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow="Checkout" title="Checkout." body="Payment status is decided by the payment provider through our server — never by this page." />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <label className="block"><span className="field-label">Email *</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" data-testid="input-checkout-email" /></label>
          <fieldset><legend className="field-label">Payment method</legend>
            <div className="mt-3 space-y-2">
              {!providers && !loadErr && <LoadingState label="Loading payment methods…" />}
              {loadErr && <ErrorState title="Payment methods unavailable" body={loadErr} />}
              {providers?.map((p) => (
                <label key={p.id} className={`card-ds flex items-center gap-3 p-4 ${p.configured ? 'cursor-pointer' : 'opacity-60'}`}>
                  <input type="radio" name="pm" disabled={!p.configured} checked={choice === p.id} onChange={() => setChoice(p.id)} /><span className="flex-1 text-sm font-semibold">{p.label}</span>
                  {!p.configured && <Badge>Payment provider not configured</Badge>}
                </label>))}
            </div>
          </fieldset>
          {hasDemo && <div role="alert" className="border border-amber-500/40 p-4 text-sm">Your cart contains demo products, which cannot be purchased. Checkout is disabled until real products are listed.</div>}
          {pay.s === 'failed' && <ErrorState title="Payment not started" body={pay.msg} />}
          <Button disabled={hasDemo || !choice || pay.s === 'working'} onClick={submit} data-testid="button-pay">{pay.s === 'working' ? 'Contacting provider…' : 'Pay securely'}</Button>
        </div>
        <Card><p className="eyebrow">Order summary</p><ul className="mt-4 space-y-2 text-sm">{lines.map((l) => <li key={l.id} className="flex justify-between gap-3"><span>{l.qty} × {l.name}</span><span className="font-mono-ui">{money(l.qty * l.priceMinor, l.currency)}</span></li>)}</ul><p className="mt-5 flex justify-between border-t border-[hsl(var(--border))] pt-4 text-sm font-semibold"><span>Total</span><span className="font-mono-ui">{money(totalMinor, currency)}</span></p></Card>
      </div>
    </div></Layout>
  );
}

export function CheckoutStatus() {
  const ref = new URLSearchParams(window.location.search).get('ref') ?? '';
  const [state, setState] = useState<{ s: 'loading' } | { s: 'error'; msg: string } | { s: 'ok'; status: string }>({ s: 'loading' });
  useEffect(() => { if (!ref) { setState({ s: 'error', msg: 'No payment reference supplied.' }); return; } api<{ status: string }>(`/payments/${encodeURIComponent(ref)}/status`).then((r) => setState(r.ok ? { s: 'ok', status: r.data.status } : { s: 'error', msg: r.error })); }, [ref]);
  return (
    <Layout><div className="page-shell container-wide max-w-2xl">
      <SectionHeader eyebrow="Payment status" title="Payment status." />
      <div className="mt-8" aria-live="polite">
        {state.s === 'loading' && <LoadingState label="Asking the server for the verified status…" />}
        {state.s === 'error' && <ErrorState title="Status unavailable" body={`${state.msg} We cannot confirm this payment from the browser.`} />}
        {state.s === 'ok' && <Card><Badge tone={state.status === 'succeeded' ? 'ok' : state.status === 'failed' ? 'danger' : 'warn'}>{state.status}</Badge><p className="mt-3 text-sm">Reference {ref}</p></Card>}
      </div>
    </div></Layout>
  );
}

export function Orders() {
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow="Orders" title="Your orders." />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <DataTable columns={[{ key: 'id', label: 'Order', render: (r: { id: string }) => r.id }]} rows={[]} empty={<EmptyState title="No orders to show" body="Order history requires sign-in and a connected order database. Neither is enabled yet, so no orders are displayed." />} />
        <Card><p className="eyebrow">Order lifecycle</p><div className="mt-5"><Timeline steps={[{ title: 'Order placed' }, { title: 'Payment verified by provider' }, { title: 'Fulfillment' }, { title: 'Shipping' }, { title: 'Delivered' }]} /></div></Card>
      </div>
    </div></Layout>
  );
}

export function Seller() {
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow="DZ Seller" title="Sell globally. WORSTART handles the route." body="Seller onboarding, product management, orders, fulfillment, shipping, payment and customer management." />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {['Seller onboarding', 'Product management', 'Orders & fulfillment'].map((t) => <Card key={t}><Badge>Coming soon</Badge><h2 className="mt-4 font-display text-xl font-bold">{t}</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Not live yet. Seller accounts require authentication and a product database.</p></Card>)}
      </div>
      <Button className="mt-8" onClick={() => openEnquiry({ service: 'E-commerce / DZ Seller' })}>Register seller interest</Button>
    </div></Layout>
  );
}
