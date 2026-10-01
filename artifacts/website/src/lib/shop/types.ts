export interface Product { id: string; name: string; category: string; description: string; priceMinor: number; currency: string; seller: string; /** true = placeholder data, never real stock */ demo: boolean }
/** Production source (e.g. Supabase) must implement this; the UI only talks to it. */
export interface ProductSource { readonly label: string; readonly isDemo: boolean; list(): Promise<Product[]>; get(id: string): Promise<Product | null> }
