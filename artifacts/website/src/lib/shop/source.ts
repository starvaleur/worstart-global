import type { ProductSource } from './types';
import { demoProducts } from './demo-seed';

/** Swap this for a Supabase-backed source when VITE_SUPABASE_URL/ANON_KEY and a products table exist. */
export const demoSource: ProductSource = {
  label: 'Demo catalogue', isDemo: true,
  list: async () => demoProducts,
  get: async (id) => demoProducts.find((p) => p.id === id) ?? null,
};
export const productSource: ProductSource = demoSource;
export const money = (minor: number, cur: string) => new Intl.NumberFormat('en', { style: 'currency', currency: cur }).format(minor / 100);
