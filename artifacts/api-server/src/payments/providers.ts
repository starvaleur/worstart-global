import { ProviderNotConfiguredError, type PaymentProvider } from "./types";

/**
 * Skeleton providers: they report whether credentials exist and refuse to act without them.
 * They intentionally do NOT simulate success. Implement the SDK calls per provider when
 * credentials and legal/business approval exist.
 */
function skeleton(id: string, label: string, requiredEnv: string[]): PaymentProvider {
  const guard = () => {
    if (!requiredEnv.every((k) => !!process.env[k])) throw new ProviderNotConfiguredError(id);
    throw new Error(`Provider "${id}" credentials are present but the SDK integration is not implemented yet.`);
  };
  return {
    id, label,
    isConfigured: () => requiredEnv.every((k) => !!process.env[k]),
    createCheckout: async () => guard(), createPayment: async () => guard(), confirmPayment: async () => guard(),
    getPaymentStatus: async () => guard(), refundPayment: async () => guard(), handleWebhook: async () => guard(),
  };
}

export const providers: PaymentProvider[] = [
  skeleton("stripe", "Stripe", ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]),
  skeleton("paypal", "PayPal", ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"]),
  skeleton("bank_transfer", "Bank transfer", ["BANK_TRANSFER_INSTRUCTIONS"]),
];

export const getProvider = (id: string) => providers.find((p) => p.id === id);
