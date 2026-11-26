import 'server-only';
import { database } from './db';
import type { CheckoutOutcome, CheckoutSource } from './checkout-click-policy';

export type CheckoutClick = {userId:string;source:CheckoutSource;lang:'zh'|'en';amount:number;currency:string;outcome:CheckoutOutcome;orderId?:string};

export async function recordCheckoutClick(click:CheckoutClick) {
  await database()`INSERT INTO checkout_clicks(user_id,source,lang,amount,currency,outcome,order_id)
    VALUES (${click.userId},${click.source},${click.lang},${click.amount},${click.currency},${click.outcome},${click.orderId??null})`;
}
