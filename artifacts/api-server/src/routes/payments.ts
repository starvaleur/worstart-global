import { Router, type IRouter } from "express";
import { getProvider, providers } from "../payments/providers";
import { ProviderNotConfiguredError } from "../payments/types";

const router: IRouter = Router();

router.get("/payments/providers", (_req, res) => {
  res.json({ providers: providers.map((p) => ({ id: p.id, label: p.label, configured: p.isConfigured() })) });
});

router.post("/payments/checkout", async (req, res) => {
  const { provider: id, reference, amountMinor, currency } = req.body ?? {};
  const provider = typeof id === "string" ? getProvider(id) : undefined;
  if (!provider) { res.status(400).json({ error: "Unknown payment provider." }); return; }
  if (!provider.isConfigured()) { res.status(501).json({ error: "Payment provider not configured.", provider: provider.id }); return; }
  if (typeof reference !== "string" || !Number.isInteger(amountMinor) || amountMinor <= 0 || typeof currency !== "string") {
    res.status(400).json({ error: "reference, amountMinor (integer > 0) and currency are required." }); return;
  }
  try {
    const origin = process.env.PUBLIC_SITE_URL ?? "";
    res.json(await provider.createCheckout({ reference, amountMinor, currency, successUrl: `${origin}/?payment=success`, cancelUrl: `${origin}/?payment=cancelled` }));
  } catch (e) {
    res.status(e instanceof ProviderNotConfiguredError ? 501 : 502).json({ error: e instanceof Error ? e.message : "Payment error." });
  }
});

/** Status is read from stored, provider-verified records only. Storage is not connected yet. */
router.get("/payments/:reference/status", (_req, res) => {
  res.status(501).json({ error: "Payment records are not connected to a database yet, so no status can be reported." });
});

/** Status shown to users must come from the provider/webhook, never from the client. */
router.post("/payments/webhooks/:provider", async (req, res) => {
  const provider = getProvider(req.params.provider);
  if (!provider || !provider.isConfigured()) { res.status(501).json({ error: "Webhook provider not configured." }); return; }
  try {
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body ?? {}));
    const event = await provider.handleWebhook(raw, req.headers);
    res.json({ received: true, type: event.type });
  } catch { res.status(400).json({ error: "Webhook verification failed." }); }
});

export default router;
