import test from 'node:test';
import assert from 'node:assert/strict';
import { PRICES, isCurrentPrice, matchesOrderPayment, priceFor } from '../src/lib/payment-product';
test('checkout prices by language: CNY 9.90 for Chinese, USD 14.99 for English', () => {
 assert.deepEqual([priceFor('zh').amount,priceFor('zh').currency],[990,'cny']);
 assert.deepEqual([priceFor('en').amount,priceFor('en').currency],[1499,'usd']);
 assert.equal(isCurrentPrice({amount:990,currency:'cny'},PRICES.zh),true);
 assert.equal(isCurrentPrice({amount:1499,currency:'usd'},PRICES.en),true);
 assert.equal(isCurrentPrice({amount:990,currency:'cny'},PRICES.en),false);
 assert.equal(isCurrentPrice({amount:1499,currency:'usd'},PRICES.zh),false);
 for (const old of [{amount:1990,currency:'cny'},{amount:699,currency:'aud'},{amount:499,currency:'aud'},{amount:300,currency:'cny'},{amount:990,currency:'aud'},{amount:50,currency:'aud'},{amount:999,currency:'usd'},{amount:2990,currency:'cny'}])
  for (const plan of Object.values(PRICES)) assert.equal(isCurrentPrice(old,plan),false);
});
test('fulfillment validates the stored order, including legacy payments', () => {
 for (const price of [{amount:990,currency:'cny'},{amount:1499,currency:'usd'},{amount:1990,currency:'cny'},{amount:699,currency:'aud'},{amount:499,currency:'aud'},{amount:300,currency:'cny'},{amount:990,currency:'aud'},{amount:50,currency:'aud'},{amount:999,currency:'usd'},{amount:2990,currency:'cny'}]) {
  const order={...price,user_id:'user_test',livemode:true};
  const session={amount_total:price.amount,currency:price.currency,client_reference_id:'user_test',livemode:true,mode:'payment'};
  assert.equal(matchesOrderPayment(order,session),true);
  for(const change of [{amount_total:1},{currency:'eur'},{client_reference_id:'another_user'},{livemode:false},{mode:'subscription'}])
   assert.equal(matchesOrderPayment(order,{...session,...change}),false);
 }
});
