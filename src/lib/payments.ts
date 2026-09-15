import 'server-only';
import Stripe from 'stripe';

export function stripeClient(){
 const key=process.env.STRIPE_SECRET_KEY;
 if(!key)throw new Error('Payments unavailable');
 return new Stripe(key);
}
export function paymentsEnabled(){
 return process.env.PAYMENTS_ENABLED==='true' && !!process.env.STRIPE_WEBHOOK_SECRET && !!process.env.STRIPE_SECRET_KEY &&
 (process.env.VERCEL_ENV!=='production'||/^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY));
}
