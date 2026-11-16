/** Public (browser-safe) configuration. Never put secrets here. */
export const config = {
  /** Formspree form id, e.g. "xyzabcde". Enquiries are only sent when this is set. */
  formspreeFormId: (import.meta.env.VITE_FORMSPREE_FORM_ID as string | undefined)?.trim() || '',
};

/** Shopify storefront URL (https only). Defaults to the live WORSTART General Store; override with VITE_SHOPIFY_STORE_URL. Shopify owns inventory, cart, checkout and store orders. */
const rawStore = (import.meta.env.VITE_SHOPIFY_STORE_URL as string | undefined)?.trim() || 'https://shop.worstartglobal.com';
export const storeUrl = /^https:\/\/[^\s]+$/i.test(rawStore) ? rawStore.replace(/\/$/, '') : '';
export const storeConfigured = () => storeUrl.length > 0;

export const enquiryConfigured = () => config.formspreeFormId.length > 0;

/** Open the enquiry modal from anywhere, optionally pre-selecting a service. */
export const ENQUIRY_EVENT = 'worstart:enquiry';
export type EnquiryPreset = { service?: string; kind?: 'logistics' | 'visa' | 'appointment'; description?: string };
export const openEnquiry = (preset: EnquiryPreset = {}) =>
  window.dispatchEvent(new CustomEvent<EnquiryPreset>(ENQUIRY_EVENT, { detail: preset }));

/** Future storefronts. Leave empty until each has a real URL and inventory; the UI then shows enquiry options instead. */
const clean = (v?: string) => (v && /^https:\/\/[^\s]+$/i.test(v.trim()) ? v.trim().replace(/\/$/, '') : '');
export const autoStoreUrl = clean(import.meta.env.VITE_AUTO_STORE_URL as string | undefined);
export const machineryStoreUrl = clean(import.meta.env.VITE_MACHINERY_STORE_URL as string | undefined);
