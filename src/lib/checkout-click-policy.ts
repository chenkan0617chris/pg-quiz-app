export const CHECKOUT_SOURCES = ['billing','upgrade_card','other'] as const;
export type CheckoutSource = typeof CHECKOUT_SOURCES[number];
export type CheckoutOutcome = 'redirected'|'already_paid'|'processing'|'rate_limited'|'error';

/** The client labels which button was clicked; anything unexpected is stored as "other". */
export function checkoutSource(value:unknown):CheckoutSource {
  return (CHECKOUT_SOURCES as readonly unknown[]).includes(value) ? value as CheckoutSource : 'other';
}
/** Owner and test accounts from comma-separated env lists, deduplicated. */
export function internalUserIds(...lists:(string|undefined)[]):string[] {
  return [...new Set(lists.flatMap(list=>(list??'').split(',')).map(id=>id.trim()).filter(Boolean))];
}
