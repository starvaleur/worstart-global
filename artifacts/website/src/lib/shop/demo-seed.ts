// DEMO DATA ONLY. These are placeholders to exercise the UI. They are not real products,
// prices or stock, and nothing here can be purchased. Replace via the Supabase source.
import type { Product } from './types';
const d = (id: string, name: string, category: string, description: string, priceMinor: number): Product =>
  ({ id, name, category, description, priceMinor, currency: 'USD', seller: 'Demo seller', demo: true });
export const demoProducts: Product[] = [
  d('demo-1', 'Sample product: shipping cartons (pack)', 'Packaging', 'Placeholder listing used to preview the product layout.', 2500),
  d('demo-2', 'Sample product: pallet wrap roll', 'Packaging', 'Placeholder listing used to preview the product layout.', 1800),
  d('demo-3', 'Sample product: handheld label printer', 'Equipment', 'Placeholder listing used to preview the product layout.', 8900),
  d('demo-4', 'Sample product: tyre set', 'Auto parts', 'Placeholder listing used to preview the product layout.', 32000),
  d('demo-5', 'Sample product: LED work light', 'Auto parts', 'Placeholder listing used to preview the product layout.', 4200),
  d('demo-6', 'Sample product: dried dates (carton)', 'Food & agriculture', 'Placeholder listing used to preview the product layout.', 5600),
];
