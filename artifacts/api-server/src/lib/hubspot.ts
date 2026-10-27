/** Server-side HubSpot boundary. Does nothing unless HUBSPOT_ACCESS_TOKEN is set. Never called from the browser. */
export type HubSpotResult = { status: "skipped"; reason: string } | { status: "synced"; contactId: string } | { status: "failed"; message: string };

export async function syncEnquiryContact(e: { email: string; name: string; phone?: string; company?: string; service: string }): Promise<HubSpotResult> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return { status: "skipped", reason: "HUBSPOT_ACCESS_TOKEN is not set." };
  const [firstname, ...rest] = e.name.trim().split(/\s+/);
  try {
    // Upsert by email: creates or updates only this contact; never deletes or touches other records.
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: [{ idProperty: "email", id: e.email.toLowerCase(), properties: { email: e.email.toLowerCase(), firstname, lastname: rest.join(" "), phone: e.phone ?? "", company: e.company ?? "" } }] }),
    });
    if (!res.ok) return { status: "failed", message: `HubSpot responded ${res.status}.` };
    const body = (await res.json()) as { results?: { id: string }[] };
    return body.results?.[0] ? { status: "synced", contactId: body.results[0].id } : { status: "failed", message: "No contact id returned." };
  } catch { return { status: "failed", message: "Network error contacting HubSpot." }; }
}
