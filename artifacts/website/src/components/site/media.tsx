import { images, type PhotoKey } from '@/content/images';
import { trustedBy } from '@/content/trusted-by';

export const hasPhoto = (k: PhotoKey) => !!images[k];

/** Renders a configured real photo, or nothing. Never a placeholder. */
export function Photo({ id, className = '', priority = false }: { id: PhotoKey; className?: string; priority?: boolean }) {
  const p = images[id];
  if (!p) return null;
  return (
    <figure className={`photo-frame ${className}`}>
      <img src={p.src} alt={p.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      {p.credit && <figcaption className="sr-only">{p.credit}</figcaption>}
    </figure>
  );
}

/** Real logos only; hidden entirely until some are provided. */
export function TrustedBy() {
  if (trustedBy.length === 0) return null;
  return (
    <section aria-labelledby="trusted-title" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--primary))] py-10">
      <div className="container-wide">
        <h2 id="trusted-title" className="text-base font-semibold text-[hsl(var(--foreground))]">Trusted by</h2>
        <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-6">
          {trustedBy.map((l) => <li key={l.name}>{l.href ? <a href={l.href} target="_blank" rel="noopener noreferrer"><img src={l.src} alt={l.name} className="h-9 w-auto opacity-80" loading="lazy" /></a> : <img src={l.src} alt={l.name} className="h-9 w-auto opacity-80" loading="lazy" />}</li>)}
        </ul>
      </div>
    </section>
  );
}
