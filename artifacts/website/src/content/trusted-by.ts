/**
 * "Trusted by" logos. Only add REAL clients/partners who have given permission, with their logo file in
 * public/images/logos/. While this list is empty the strip is not rendered — nothing is invented.
 */
export interface TrustedLogo { name: string; src: string; href?: string }
export const trustedBy: TrustedLogo[] = [];
