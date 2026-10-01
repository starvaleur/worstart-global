import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { ArrowUpRight, AlertTriangle, Loader2, Inbox } from 'lucide-react';

export function Button({ variant = 'primary', icon = true, className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline'; icon?: boolean }) {
  const cls = variant === 'primary' ? 'button-primary' : variant === 'secondary' ? 'button-secondary' : 'button-cta-outline';
  return <button type="button" className={`${cls} disabled:opacity-50 ${className}`} {...rest}>{children}{icon && <ArrowUpRight className="h-4 w-4" />}</button>;
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'accent' | 'warn' | 'ok' | 'danger'; children: ReactNode }) {
  const t = { neutral: 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]', accent: 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]', warn: 'border-amber-500/60 text-amber-400', ok: 'border-emerald-500/60 text-emerald-400', danger: 'border-[hsl(var(--destructive))] text-[hsl(var(--destructive))]' }[tone];
  return <span className={`inline-flex items-center border px-2 py-1 font-mono-ui text-[0.55rem] uppercase tracking-[.12em] ${t}`}>{children}</span>;
}

export function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div><p className="eyebrow">{eyebrow}</p><h1 className="mt-4 font-display text-4xl font-bold leading-[1] tracking-[-.045em] md:text-6xl">{title}</h1></div>
      {body && <p className="max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))] lg:pt-6">{body}</p>}
    </div>
  );
}

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`card-ds p-6 ${className}`}>{children}</div>;

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="glass flex flex-col items-center px-6 py-14 text-center" role="status"><Inbox className="h-8 w-8 text-[hsl(var(--accent))]" strokeWidth={1.3} /><h2 className="mt-4 font-display text-2xl font-bold">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">{body}</p>{action && <div className="mt-6">{action}</div>}</div>;
}
export const LoadingState = ({ label = 'Loading…' }: { label?: string }) => <div className="flex items-center justify-center gap-3 py-14 text-sm text-[hsl(var(--muted-foreground))]" role="status" aria-live="polite"><Loader2 className="h-4 w-4 animate-spin" />{label}</div>;
export const ErrorState = ({ title = 'Something went wrong', body, action }: { title?: string; body: string; action?: ReactNode }) => (
  <div className="flex gap-3 border border-[hsl(var(--destructive))] p-5 text-sm leading-6" role="alert"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--destructive))]" /><div><p className="font-semibold">{title}</p><p className="text-[hsl(var(--muted-foreground))]">{body}</p>{action}</div></div>
);

export function Timeline({ steps, current = -1 }: { steps: { title: string; body?: string }[]; current?: number }) {
  return <ol className="space-y-5 border-l border-[hsl(var(--border))] pl-6">{steps.map((s, i) => <li key={s.title} className="relative"><span className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full ${i <= current ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--border))]'}`} /><p className="text-sm font-semibold">{s.title}</p>{s.body && <p className="text-xs leading-5 text-[hsl(var(--muted-foreground))]">{s.body}</p>}</li>)}</ol>;
}

/** Responsive table: scrolls horizontally inside its own container, never the page. */
export function DataTable<T>({ columns, rows, empty }: { columns: { key: string; label: string; render: (r: T) => ReactNode }[]; rows: T[]; empty: ReactNode }) {
  if (!rows.length) return <>{empty}</>;
  return (
    <div className="table-scroll border border-[hsl(var(--border))]"><table className="w-full min-w-[560px] text-left text-sm">
      <thead><tr>{columns.map((c) => <th key={c.key} className="field-label border-b border-[hsl(var(--border))] p-3">{c.label}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0">{columns.map((c) => <td key={c.key} className="p-3">{c.render(r)}</td>)}</tr>)}</tbody>
    </table></div>
  );
}
