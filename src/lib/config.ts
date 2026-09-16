/** Shared business-rule constants used by both client UI and server services. */
export const FREE_SHIPPING_THRESHOLD = 1999;
export const SHIPPING_FEE = 149;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
}
