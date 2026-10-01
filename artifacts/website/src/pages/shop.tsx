import { useEffect, useMemo, useState } from 'react';
import { Link, useRoute } from 'wouter';
import { Search, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/site/layout';
import { Badge, Button, EmptyState, ErrorState, LoadingState, SectionHeader } from '@/components/site/ds';
import { productSource, money } from '@/lib/shop/source';
import { cart } from '@/lib/shop/cart';
import type { Product } from '@/lib/shop/types';

function useProducts() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { productSource.list().then(setItems).catch(() => setError('The product catalogue could not be loaded.')); }, []);
  return { items, error };
}

export const DemoNotice = () => productSource.isDemo ? (
  <div className="mt-8 flex flex-wrap items-center gap-3 border border-amber-500/40 p-4 text-sm"><Badge tone="warn">Demo catalogue</Badge><span className="text-[hsl(var(--muted-foreground))]">These are placeholder products to preview the shop. They are not real inventory and cannot be purchased.</span></div>
) : null;

export default function Shop() {
  const { items, error } = useProducts();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = useMemo(() => ['All', ...Array.from(new Set((items ?? []).map((p) => p.category)))], [items]);
  const list = (items ?? []).filter((p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow="Shop / products" title="WORSTART shop." body="A commerce foundation connecting product, seller, payment, fulfillment and delivery." />
      <DemoNotice />
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end">
        <label className="flex-1"><span className="field-label">Search products</span><span className="relative block"><Search className="absolute left-0 top-[1.15rem] h-4 w-4 text-[hsl(var(--muted-foreground))]" /><input value={q} onChange={(e) => setQ(e.target.value)} className="field-input pl-7" data-testid="input-shop-search" /></span></label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">{cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`min-h-11 border px-3 text-xs font-semibold ${cat === c ? 'border-[hsl(var(--accent))] bg-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]'}`}>{c}</button>)}</div>
      </div>
      <div className="mt-10">
        {error ? <ErrorState body={error} /> : !items ? <LoadingState label="Loading products…" /> : list.length === 0 ? <EmptyState title="No products found" body="Try a different search or category." /> : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => (
            <li key={p.id} className="card-ds card-ds-hover flex flex-col p-5">
              <div className="flex items-center justify-between"><Badge>{p.category}</Badge>{p.demo && <Badge tone="warn">Demo</Badge>}</div>
              <Link href={`/product/${p.id}`} className="mt-5 font-display text-lg font-bold hover:text-[hsl(var(--accent))]">{p.name}</Link>
              <p className="mt-2 flex-1 text-sm text-[hsl(var(--muted-foreground))]">{p.description}</p>
              <div className="mt-5 flex items-center justify-between"><span className="font-mono-ui text-sm">{money(p.priceMinor, p.currency)}</span><Button variant="secondary" icon={false} onClick={() => cart.add({ id: p.id, name: p.name, priceMinor: p.priceMinor, currency: p.currency, demo: p.demo })}><ShoppingCart className="h-4 w-4" />Add</Button></div>
            </li>))}</ul>)}
      </div>
    </div></Layout>
  );
}

export function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [p, setP] = useState<Product | null | undefined>(undefined);
  useEffect(() => { if (params?.id) productSource.get(params.id).then(setP).catch(() => setP(null)); }, [params?.id]);
  return (
    <Layout><div className="page-shell container-wide">
      {p === undefined ? <LoadingState /> : p === null ? <EmptyState title="Product not found" body="This product does not exist." action={<Link href="/shop" className="button-secondary">Back to shop</Link>} /> : (
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="glass flex aspect-[4/3] items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">No image</div>
          <div>
            <div className="flex gap-2"><Badge>{p.category}</Badge>{p.demo && <Badge tone="warn">Demo — not real inventory</Badge>}</div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-[-.03em]">{p.name}</h1>
            <p className="mt-2 font-mono-ui text-xl">{money(p.priceMinor, p.currency)}</p>
            <p className="mt-5 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{p.description}</p>
            <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">Sold by {p.seller}. Shipping and fulfillment options are confirmed at checkout.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => cart.add({ id: p.id, name: p.name, priceMinor: p.priceMinor, currency: p.currency, demo: p.demo })}>Add to cart</Button><Link href="/cart" className="button-secondary">View cart</Link></div>
          </div>
        </div>)}
    </div></Layout>
  );
}
