'use client';
import { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useI18n } from './i18n';

/** Opens Stripe checkout for the 7-day pass. Shared by the billing page and the in-place upgrade card. */
export function useCheckout() {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const { lang } = useI18n(), zh = lang === 'zh';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function buy() {
    if (!isSignedIn) { await clerk.openSignIn(); return; }
    const unavailable = zh ? '暂时无法付款，请稍后重试。' : 'Checkout is currently unavailable.';
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang }) });
      if (response.status === 401) { await clerk.openSignIn(); return; }
      if (!response.ok) {
        setError(response.status === 409
          ? (zh ? '当前付费使用权仍有效，或付款正在确认，请稍后刷新账户状态。' : 'Paid access is still active or payment is processing. Please refresh shortly.')
          : unavailable);
        return;
      }
      const { url } = await response.json();
      if (typeof url !== 'string' || new URL(url).hostname !== 'checkout.stripe.com') throw new Error('Invalid checkout');
      window.location.assign(url);
    } catch { setError(unavailable); } finally { setBusy(false); }
  }
  return { buy, busy, error };
}
