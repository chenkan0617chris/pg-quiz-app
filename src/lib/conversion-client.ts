'use client';

export type ClientConversionEvent = 'mock_paywall_viewed' | 'upgrade_prompt_viewed' | 'pricing_viewed';

/** Fire-and-forget funnel ping; the server dedupes per person per Sydney day. */
export function reportConversion(event: ClientConversionEvent) {
  void fetch('/api/conversion', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event }), keepalive: true,
  }).catch(() => { /* telemetry must never break the page */ });
}
