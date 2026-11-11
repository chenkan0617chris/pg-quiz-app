import type { Language } from './language';

export type PricePlan = {
 /** Smallest currency unit, as Stripe and payment_orders store it. */
 amount: number;
 currency: 'cny' | 'usd';
 /** Shown on pages and buttons. */
 label: string;
 /** ISO code shown next to the price. */
 code: 'CNY' | 'USD';
};

/**
 * Seven-day access is priced by site language: Chinese pages keep CNY 9.90 so
 * Alipay and WeChat Pay stay available; English pages charge USD 14.99.
 * Both grant 168 hours (migration 017).
 */
export const PRICES: Record<Language, PricePlan> = {
 zh: { amount: 990, currency: 'cny', label: '¥9.9', code: 'CNY' },
 en: { amount: 1499, currency: 'usd', label: 'US$14.99', code: 'USD' },
};

export function priceFor(lang: Language): PricePlan {
 return PRICES[lang];
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
