import { useSyncExternalStore } from 'react';

export interface CartLine { id: string; name: string; priceMinor: number; currency: string; qty: number; demo: boolean }
const KEY = 'worstart.cart.v1';
let lines: CartLine[] = [];
try { lines = JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { lines = []; }
const subs = new Set<() => void>();
const commit = (next: CartLine[]) => { lines = next; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ } subs.forEach((f) => f()); };

export const cart = {
  add: (l: Omit<CartLine, 'qty'>) => commit(lines.some((x) => x.id === l.id) ? lines.map((x) => (x.id === l.id ? { ...x, qty: x.qty + 1 } : x)) : [...lines, { ...l, qty: 1 }]),
  setQty: (id: string, qty: number) => commit(qty <= 0 ? lines.filter((x) => x.id !== id) : lines.map((x) => (x.id === id ? { ...x, qty } : x))),
  remove: (id: string) => commit(lines.filter((x) => x.id !== id)),
  clear: () => commit([]),
};
export function useCart() {
  const l = useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => lines);
  return { lines: l, count: l.reduce((n, x) => n + x.qty, 0), totalMinor: l.reduce((n, x) => n + x.qty * x.priceMinor, 0), currency: l[0]?.currency ?? 'USD' };
}
