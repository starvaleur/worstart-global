import { Link } from 'wouter';
import { Layout } from '@/components/site/layout';
import { Badge, EmptyState, SectionHeader } from '@/components/site/ds';

const areas = ['shipments', 'orders', 'payments', 'documents', 'appointments', 'visa', 'profile'];

/** Honest gate: no authentication is configured, so no account data is ever shown. */
export default function Dashboard({ area }: { area?: string }) {
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow={`Dashboard${area ? ` / ${area}` : ''}`} title={area ? area[0].toUpperCase() + area.slice(1) : 'Customer dashboard.'} />
      <div className="mt-8 flex flex-wrap gap-2"><Link href="/dashboard" className="button-secondary">Overview</Link>{areas.map((a) => <Link key={a} href={`/dashboard/${a}`} className="button-secondary">{a}</Link>)}</div>
      <div className="mt-10"><EmptyState title="Sign-in is not available yet" body="The dashboard needs authentication and a connected database. Both are being prepared, so no account data is shown and nothing here is simulated." action={<Badge>Authentication: not configured</Badge>} /></div>
    </div></Layout>
  );
}
