import 'server-only';
import { database } from './db';

export const CONVERSION_EVENTS = ['mock_paywall_viewed','checkout_started','payment_completed'] as const;
export type ConversionEvent = typeof CONVERSION_EVENTS[number];

/** One person counts once per conversion milestone per Sydney calendar day. */
export async function recordConversion(userId:string,event:ConversionEvent) {
  await database()`INSERT INTO conversion_events(user_id,event) VALUES (${userId},${event})
    ON CONFLICT(user_id,event,event_day) DO NOTHING`;
}
