/**
 * Real photography only. Add files under public/images/ and register them here with alt text and the
 * licence/credit. Anything left undefined simply doesn't render (layouts fall back to text) — no placeholders.
 */
export type PhotoKey = 'hero' | 'freight' | 'importExport' | 'vehicles' | 'warehouse';
export interface PhotoEntry { src: string; alt: string; credit?: string }
export const images: Partial<Record<PhotoKey, PhotoEntry>> = {
  // hero: { src: '/images/hero.jpg', alt: 'Container ship loading at a port', credit: 'Photographer / licence URL' },
};
