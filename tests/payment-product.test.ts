import test from 'node:test';
import assert from 'node:assert/strict';
import { isCurrentPrice, matchesOrderPayment } from '../src/lib/payment-product';
test('new checkout uses AUD 9.90 and replaces previous prices', () => {
 assert.equal(isCurrentPrice({amount:990,currency:'aud'}),true);
 assert.equal(isCurrentPrice({amount:50,currency:'aud'}),false);
 assert.equal(isCurrentPrice({amount:999,currency:'usd'}),false);
 assert.equal(isCurrentPrice({amount:2990,currency:'cny'}),false);
});
test('fulfillment validates the stored order, including legacy CNY payments', () => {
 for (const price of [{amount:990,currency:'aud'},{amount:50,currency:'aud'},{amount:999,currency:'usd'},{amount:2990,currency:'cny'}]) {
  const order={...price,user_id:'user_test',livemode:true};
  const session={amount_total:price.amount,currency:price.currency,client_reference_id:'user_test',livemode:true,mode:'payment'};
  assert.equal(matchesOrderPayment(order,session),true);
  for(const change of [{amount_total:1},{currency:'eur'},{client_reference_id:'another_user'},{livemode:false},{mode:'subscription'}])
   assert.equal(matchesOrderPayment(order,{...session,...change}),false);
 }
});
