export type PaymentStatus = "requires_action" | "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded";

export interface CheckoutInput { reference: string; amountMinor: number; currency: string; successUrl: string; cancelUrl: string; customerEmail?: string }
export interface CheckoutResult { provider: string; reference: string; redirectUrl?: string; clientSecret?: string }
export interface PaymentRecord { provider: string; providerPaymentId: string; reference: string; status: PaymentStatus }
export interface WebhookEvent { type: string; reference: string; status: PaymentStatus; raw?: unknown }

/** Every provider implements this. Secrets are read from server env only. */
export interface PaymentProvider {
  readonly id: string;
  readonly label: string;
  /** True only when all required credentials are present in the environment. */
  isConfigured(): boolean;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  createPayment(input: CheckoutInput): Promise<CheckoutResult>;
  confirmPayment(providerPaymentId: string): Promise<PaymentRecord>;
  getPaymentStatus(providerPaymentId: string): Promise<PaymentRecord>;
  refundPayment(providerPaymentId: string, amountMinor?: number): Promise<PaymentRecord>;
  /** Must verify the provider signature against the raw body before returning an event. */
  handleWebhook(rawBody: Buffer, headers: Record<string, string | string[] | undefined>): Promise<WebhookEvent>;
}

export class ProviderNotConfiguredError extends Error {
  constructor(public providerId: string) { super(`Payment provider "${providerId}" is not configured.`); }
}
