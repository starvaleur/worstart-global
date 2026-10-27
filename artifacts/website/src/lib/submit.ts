import { config, enquiryConfigured } from '@/lib/config';
export type SubmitResult = { ok: true } | { ok: false; reason: 'not_configured' | 'failed'; message: string };
/** Single Formspree submission path used by every request form. */
export async function submitRequest(kind: string, subject: string, data: Record<string, string>): Promise<SubmitResult> {
  if (!enquiryConfigured()) return { ok: false, reason: 'not_configured', message: 'The request service is not configured on this deployment yet (VITE_FORMSPREE_FORM_ID is missing). Nothing was sent.' };
  try {
    const res = await fetch(`https://formspree.io/f/${config.formspreeFormId}`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, enquiryType: kind, _subject: subject }) });
    if (!res.ok) { const b = await res.json().catch(() => ({})); return { ok: false, reason: 'failed', message: b?.errors?.[0]?.message || `Request failed (${res.status}).` }; }
    return { ok: true };
  } catch { return { ok: false, reason: 'failed', message: 'Network error.' }; }
}
