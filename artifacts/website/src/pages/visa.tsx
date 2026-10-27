import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Check } from 'lucide-react';
import { Layout } from '@/components/site/layout';
import { Badge, Button, Card, ErrorState, SectionHeader, Timeline } from '@/components/site/ds';
import { destinations, visaTypes, appointmentServices, DISCLAIMER } from '@/lib/visa';
import { submitRequest } from '@/lib/submit';

const flow = ['Destination', 'Visa type', 'Document checklist', 'Applicant information', 'Assistance request', 'Appointment request'];
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className={`min-h-11 border px-4 text-sm font-semibold ${on ? 'border-[hsl(var(--accent))] bg-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]'}`}>{children}</button>
);
const Notice = () => <p className="mt-6 border-l-2 border-[hsl(var(--accent))] pl-4 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{DISCLAIMER}</p>;

export function Visa() {
  const [dest, setDest] = useState(''); const [type, setType] = useState(''); const [, nav] = useLocation();
  return (
    <Layout><div className="page-shell container-wide">
      <SectionHeader eyebrow="Visa services" title="Visa assistance, prepared properly." body="Choose a destination and visa type to see a general document checklist, then request assistance." />
      <Notice />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="field-label">1 · Destination</p><div className="mt-3 flex flex-wrap gap-2">{destinations.map((d) => <Pill key={d} on={dest === d} onClick={() => setDest(d)}>{d}</Pill>)}</div>
          <p className="field-label mt-8">2 · Visa type</p><div className="mt-3 flex flex-wrap gap-2">{Object.keys(visaTypes).map((t) => <Pill key={t} on={type === t} onClick={() => setType(t)}>{t}</Pill>)}</div>
          <div className="mt-10"><Timeline steps={flow.map((t) => ({ title: t }))} current={!dest ? 0 : !type ? 1 : 2} /></div>
        </div>
        <Card><p className="field-label">3 · Document checklist</p>
          <div aria-live="polite">{type ? <><ul className="mt-4 space-y-2 text-sm">{visaTypes[type].map((d) => <li key={d} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />{d}</li>)}</ul><p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">General checklist only. Requirements change often — confirm with the official authority{dest ? ` for ${dest}` : ''}.</p></> : <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Select a destination and visa type.</p>}</div>
          <Button className="mt-6" disabled={!dest || !type} onClick={() => nav(`/visa/request?dest=${encodeURIComponent(dest)}&type=${encodeURIComponent(type)}`)} data-testid="button-visa-continue">Request assistance</Button>
        </Card>
      </div>
    </div></Layout>
  );
}

type St = { s: 'idle' } | { s: 'sending' } | { s: 'done' } | { s: 'error'; msg: string };

function RequestForm({ kind, title, preset }: { kind: 'visa_request' | 'appointment_request'; title: string; preset: { dest: string; type: string } }) {
  const [st, setSt] = useState<St>({ s: 'idle' }); const [errs, setErrs] = useState<Record<string, string>>({});
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const er: Record<string, string> = {};
    if (!d.name?.trim()) er.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? '')) er.email = 'Enter a valid email address.';
    if (!d.destination) er.destination = 'Choose a destination.';
    if (!d.visaType) er.visaType = 'Choose a visa type.';
    if (d.hp) return; setErrs(er); if (Object.keys(er).length) return;
    setSt({ s: 'sending' });
    const r = await submitRequest(kind, `WORSTART ${title}: ${d.destination}`, d);
    setSt(r.ok ? { s: 'done' } : { s: 'error', msg: r.message });
  }
  if (st.s === 'done') return <Card><div role="status"><Badge tone="ok">Request sent</Badge><h2 className="mt-4 font-display text-2xl font-bold">Request received by our form service.</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">This is a request, not a confirmed appointment or application. Our team will reply by email.</p></div></Card>;
  const field = (n: string, label: string, type = 'text', req = false) => (<label className="block"><span className="field-label">{label}{req && ' *'}</span><input name={n} type={type} className="field-input" aria-invalid={!!errs[n]} />{errs[n] && <span role="alert" className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errs[n]}</span>}</label>);
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {st.s === 'error' && <div className="sm:col-span-2"><ErrorState title="Request not sent" body={st.msg} /></div>}
      {field('name', 'Full name', 'text', true)}{field('email', 'Email', 'email', true)}{field('phone', 'Phone', 'tel')}{field('nationality', 'Nationality')}
      <label className="block"><span className="field-label">Destination *</span><select name="destination" defaultValue={preset.dest} className="field-input"><option value="" disabled>Choose</option>{destinations.map((d) => <option key={d}>{d}</option>)}</select>{errs.destination && <span role="alert" className="text-xs text-[hsl(var(--destructive))]">{errs.destination}</span>}</label>
      <label className="block"><span className="field-label">Visa type *</span><select name="visaType" defaultValue={preset.type} className="field-input"><option value="" disabled>Choose</option>{Object.keys(visaTypes).map((d) => <option key={d}>{d}</option>)}</select>{errs.visaType && <span role="alert" className="text-xs text-[hsl(var(--destructive))]">{errs.visaType}</span>}</label>
      {kind === 'appointment_request' ? (<>
        <label className="block"><span className="field-label">Service</span><select name="serviceType" className="field-input">{appointmentServices.map((s) => <option key={s}>{s}</option>)}</select></label>
        {field('preferredDate', 'Preferred date', 'date')}{field('preferredTime', 'Preferred time', 'time')}
      </>) : <label className="block sm:col-span-2"><span className="field-label">Notes</span><textarea name="notes" rows={4} className="field-input resize-none" /></label>}
      <input name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="sm:col-span-2"><Button type="submit" disabled={st.s === 'sending'} data-testid="button-visa-submit">{st.s === 'sending' ? 'Sending…' : kind === 'appointment_request' ? 'Request appointment assistance' : 'Send assistance request'}</Button></div>
    </form>
  );
}

export function VisaRequest() {
  const q = new URLSearchParams(window.location.search);
  return (
    <Layout><div className="page-shell container-wide max-w-3xl">
      <SectionHeader eyebrow="Visa / request" title="Request visa assistance." /><Notice />
      <div className="mt-8"><RequestForm kind="visa_request" title="visa assistance" preset={{ dest: q.get('dest') ?? '', type: q.get('type') ?? '' }} /></div>
      <p className="mt-8 text-sm text-[hsl(var(--muted-foreground))]">Need an appointment instead? <Link href="/appointments" className="text-[hsl(var(--accent))] underline">Request appointment assistance</Link>.</p>
    </div></Layout>
  );
}

export function Appointments() {
  return (
    <Layout><div className="page-shell container-wide max-w-3xl">
      <SectionHeader eyebrow="Appointments" title="Request appointment assistance." body="Appointment availability must be confirmed. No slots are shown because we have no official appointment integration." /><Notice />
      <div className="mt-8"><RequestForm kind="appointment_request" title="appointment assistance" preset={{ dest: '', type: '' }} /></div>
    </div></Layout>
  );
}
