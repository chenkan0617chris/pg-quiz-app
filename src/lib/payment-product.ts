import type { Language } from './language';

export type PricePlan = {
 /** Smallest currency unit, as Stripe and payment_orders store it. */
 amount: number;
  currency: 'usd' | 'aud';
 /** Shown on pages and buttons. */
 label: string;
 /** ISO code for structured data. */
  code: 'USD' | 'AUD';
};

/**
 * A seven-day pass is priced by page language. English pages charge $6.99 in US dollars
 * (US$14.99 until 2026-11-22). Chinese pages charge A$9.90 in Australian dollars from
 * 2026-11-26: an Australian Stripe account offers Alipay and WeChat Pay only in AUD or CNY,
 * so the USD price removed both. Both grant 168 hours (migrations 022 and 023).
 */
export const PRICES: Record<Language, PricePlan> = {
 en: { amount: 699, currency: 'usd', label: '$6.99', code: 'USD' },
 zh: { amount: 990, currency: 'aud', label: 'A$9.90', code: 'AUD' },
};

export function priceFor(language: Language): PricePlan {
 return PRICES[language];
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
