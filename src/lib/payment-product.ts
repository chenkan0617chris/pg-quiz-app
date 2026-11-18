import type { Language } from './language';

export type PricePlan = {
 /** Smallest currency unit, as Stripe and payment_orders store it. */
 amount: number;
  currency: 'usd';
 /** Shown on pages and buttons. */
 label: string;
 /** ISO code shown next to the price. */
  code: 'USD';
};

/**
 * A seven-day pass costs US$14.99 everywhere. Language only changes the copy,
 * never the checkout currency or amount.
 */
export const PRICE: PricePlan = {
 amount: 1499, currency: 'usd', label: 'US$14.99', code: 'USD',
};

/** @deprecated The language argument is retained for existing display callers. */
export function priceFor(_language?: Language): PricePlan {
 void _language;
 return PRICE;
}

/** True when an existing pending order already carries this plan's price. */
export function isCurrentPrice(order: { amount: number; currency: string }, plan: PricePlan) {
 return order.amount === plan.amount && order.currency === plan.currency;
}

export function matchesOrderPayment(
 order: { amount: number; currency: string; user_id: string; livemode: boolean },
 session: { amount_total: number | null; currency: string | null; client_reference_id: string | null; livemode: boolean; mode: string },
) {
 return session.mode === 'payment' && session.client_reference_id === order.user_id &&
  session.livemode === order.livemode && session.amount_total === order.amount && session.currency === order.currency;
}
