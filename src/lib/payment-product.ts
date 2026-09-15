export const PRICE_AMOUNT = 990;
export const PRICE_CURRENCY = 'aud';
export const PRICE_LABEL = 'A$9.90 AUD';

export function isCurrentPrice(order: { amount: number; currency: string }) {
 return order.amount === PRICE_AMOUNT && order.currency === PRICE_CURRENCY;
}

export function matchesOrderPayment(
 order: { amount: number; currency: string; user_id: string; livemode: boolean },
 session: { amount_total: number | null; currency: string | null; client_reference_id: string | null; livemode: boolean; mode: string },
) {
 return session.mode === 'payment' && session.client_reference_id === order.user_id &&
  session.livemode === order.livemode && session.amount_total === order.amount && session.currency === order.currency;
}
