import test from 'node:test';
import assert from 'node:assert/strict';

import { isCurrentPrice, priceFor } from '../src/lib/payment-product';

test('English pages sell the $6.99 seven-day pass in US dollars', () => {
  assert.deepEqual(priceFor('en'), { amount: 699, currency: 'usd', label: '$6.99', code: 'USD' });
});

test('Chinese pages sell the seven-day pass for A$9.90 so Alipay and WeChat Pay are offered', () => {
  assert.deepEqual(priceFor('zh'), { amount: 990, currency: 'aud', label: 'A$9.90', code: 'AUD' });
});

test('an order in another currency or amount is not reused for checkout', () => {
  const zh = priceFor('zh'), en = priceFor('en');
  assert.equal(isCurrentPrice({ amount: 990, currency: 'aud' }, zh), true);
  assert.equal(isCurrentPrice({ amount: 990, currency: 'cny' }, zh), false);
  assert.equal(isCurrentPrice({ amount: 699, currency: 'usd' }, zh), false);
  assert.equal(isCurrentPrice({ amount: 699, currency: 'usd' }, en), true);
  assert.equal(isCurrentPrice({ amount: 990, currency: 'aud' }, en), false);
  assert.equal(isCurrentPrice({ amount: 1499, currency: 'usd' }, en), false);
});
