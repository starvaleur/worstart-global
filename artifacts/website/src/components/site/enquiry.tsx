import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, X, AlertTriangle } from 'lucide-react';
import { config, enquiryConfigured, type EnquiryPreset } from '@/lib/config';

export const SERVICES = [
  'Import goods', 'Export goods', 'Import a car', 'Export a car', 'Commercial cargo', 'Personal cargo',
  'Fulfillment & warehousing', 'Customs & documentation', 'E-commerce / DZ Seller', 'Vehicle leasing / booking',
  'Visa assistance', 'Visa appointment assistance', 'Other',
];

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'not-configured';
type Errors = Partial<Record<string, string>>;

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function Field({ name, label, type = 'text', required, placeholder, errors, inputRef }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string; errors: Errors; inputRef?: React.Ref<HTMLInputElement> }) {
  return (
    <label className="block">
      <span className="field-label">{label}{required && ' *'}</span>
      <input ref={inputRef} name={name} type={type} className="field-input" placeholder={placeholder}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `err-${name}` : undefined} data-testid={`input-enquiry-${name}`} />
      {errors[name] && <span id={`err-${name}`} role="alert" className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors[name]}</span>}
    </label>
  );
}

export function EnquiryModal({ preset, onClose }: { preset: EnquiryPreset; onClose: () => void }) {
  const [status, setStatus] = useState<Status>(enquiryConfigured() ? 'idle' : 'not-configured');
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');
  const first = useRef<HTMLInputElement>(null);
  const isVisa = preset.kind === 'visa' || preset.kind === 'appointment';

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    first.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const next: Errors = {};
    if (!data.name?.trim()) next.name = 'Enter your full name.';
    if (!emailOk(data.email ?? '')) next.email = 'Enter a valid email address.';
    if (!data.service) next.service = 'Choose a service.';
    if (!data.description?.trim() || data.description.trim().length < 10) next.description = 'Add a few details (at least 10 characters).';
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!enquiryConfigured()) { setStatus('not-configured'); return; }
    if (data.website) return; // honeypot
    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${config.formspreeFormId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _subject: `WORSTART enquiry: ${data.service}`, enquiryType: preset.kind ?? 'logistics' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.errors?.[0]?.message || `Request failed (${res.status}).`);
      }
      setStatus('success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Network error.');
      setStatus('error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[hsl(var(--primary)/.78)] p-4 backdrop-blur-sm sm:items-center"
      role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="modal-in relative my-6 w-full max-w-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-2xl sm:p-9"
        role="dialog" aria-modal="true" aria-labelledby="enquiry-title" data-testid="contact-modal">
        <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4" aria-label="Close enquiry" data-testid="button-close-contact"><X className="h-5 w-5" /></button>

        {status === 'success' ? (
          <div className="py-10 text-center" role="status">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent)/.14)] text-[hsl(var(--accent))]"><Check className="h-6 w-6" /></div>
            <h2 id="enquiry-title" className="mt-6 font-display text-3xl font-bold">Enquiry sent.</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Your enquiry was accepted by our form service. The team will review it and reply by email. This is a request, not a confirmed booking or quote.</p>
            <button type="button" onClick={onClose} className="button-secondary mt-7" data-testid="button-close-confirmation">Close</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{isVisa ? 'Visa assistance request' : 'Start a logistics enquiry'}</p>
            <h2 id="enquiry-title" className="mt-4 font-display text-3xl font-bold leading-[1.06]">{isVisa ? 'Request visa assistance.' : 'Start a logistics enquiry.'}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">No quote is generated automatically. Our team reviews every request and replies by email.</p>

            {status === 'not-configured' && (
              <div role="alert" className="mt-5 flex gap-3 border border-[hsl(var(--border))] p-4 text-sm leading-6" data-testid="enquiry-not-configured">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                <span>The enquiry service is not configured on this deployment yet (<code>VITE_FORMSPREE_FORM_ID</code> is missing), so nothing can be sent. Please try again later.</span>
              </div>
            )}
            {status === 'error' && (
              <div role="alert" className="mt-5 flex gap-3 border border-[hsl(var(--destructive))] p-4 text-sm leading-6" data-testid="enquiry-error">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--destructive))]" />
                <span>We could not send your enquiry: {message} Your details are still in the form — please try again.</span>
              </div>
            )}

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
              <Field errors={errors} inputRef={first} name="name" label="Full name" required />
              <Field errors={errors} name="email" label="Email" type="email" required placeholder="you@company.com" />
              <Field errors={errors} name="phone" label="Phone" type="tel" />
              <Field errors={errors} name="company" label="Company" />
              <label className="block sm:col-span-2">
                <span className="field-label">Service *</span>
                <select name="service" defaultValue={preset.service ?? ''} className="field-input" aria-invalid={!!errors.service} data-testid="select-enquiry-service">
                  <option value="" disabled>Choose a service</option>
                  {SERVICES.map((s) => <option key={s}>{s}</option>)}
                </select>
                {errors.service && <span role="alert" className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.service}</span>}
              </label>
              <Field errors={errors} name="origin" label={isVisa ? 'Country of residence' : 'Origin'} />
              <Field errors={errors} name="destination" label={isVisa ? 'Destination' : 'Destination'} />
              <Field errors={errors} name="cargoType" label={isVisa ? 'Visa type' : 'Cargo / vehicle type'} />
              <Field errors={errors} name="timeline" label="Preferred timeline" />
              {!isVisa && <Field errors={errors} name="weight" label="Weight (optional)" />}
              {!isVisa && <Field errors={errors} name="volume" label="Volume (optional)" />}
              <label className="block sm:col-span-2">
                <span className="field-label">Description *</span>
                <textarea name="description" defaultValue={preset.description ?? ''} rows={4} className="field-input resize-none" aria-invalid={!!errors.description} data-testid="input-enquiry-description" />
                {errors.description && <span role="alert" className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.description}</span>}
              </label>
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <button type="submit" disabled={status === 'submitting' || status === 'not-configured'} className="button-primary flex w-full justify-between disabled:opacity-50 sm:col-span-2" data-testid="button-submit-contact">
                {status === 'submitting' ? 'Sending…' : 'Send enquiry'} <ArrowUpRight className="h-4 w-4" />
              </button>
              <p className="sm:col-span-2 font-mono-ui text-[0.58rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]" aria-live="polite">
                {status === 'submitting' ? 'Sending your enquiry' : 'Requests only — not a quote, booking or government submission.'}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
