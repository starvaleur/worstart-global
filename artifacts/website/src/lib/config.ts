/** Public (browser-safe) configuration. Never put secrets here. */
export const config = {
  /** Formspree form id, e.g. "xyzabcde". Enquiries are only sent when this is set. */
  formspreeFormId: (import.meta.env.VITE_FORMSPREE_FORM_ID as string | undefined)?.trim() || '',
};

export const enquiryConfigured = () => config.formspreeFormId.length > 0;

/** Open the enquiry modal from anywhere, optionally pre-selecting a service. */
export const ENQUIRY_EVENT = 'worstart:enquiry';
export type EnquiryPreset = { service?: string; kind?: 'logistics' | 'visa' | 'appointment'; description?: string };
export const openEnquiry = (preset: EnquiryPreset = {}) =>
  window.dispatchEvent(new CustomEvent<EnquiryPreset>(ENQUIRY_EVENT, { detail: preset }));
