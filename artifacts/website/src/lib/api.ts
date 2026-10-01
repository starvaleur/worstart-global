/** API base. On Vercel the Express API is not deployed, so calls fail visibly instead of faking results. */
export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';
export async function api<T>(path: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return { ok: false, status: res.status, error: 'The payment service is not reachable on this deployment.' };
    const body = await res.json();
    return res.ok ? { ok: true, data: body as T } : { ok: false, status: res.status, error: body?.error ?? `Request failed (${res.status}).` };
  } catch { return { ok: false, status: 0, error: 'Network error — the service could not be reached.' }; }
}
