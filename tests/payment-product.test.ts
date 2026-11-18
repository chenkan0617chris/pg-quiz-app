import test from 'node:test';
import assert from 'node:assert/strict';

import { isCurrentPrice, priceFor } from '../src/lib/payment-product';

test('every language sells the same US$14.99 seven-day pass', () => {
  for (const language of ['zh', 'en'] as const) {
    assert.deepEqual(priceFor(language), {
      amount: 1499,
      currency: 'usd',
      label: 'US$14.99',
      code: 'USD',
    });
  }
});

test('a legacy CNY order is not treated as the current checkout price', () => {
  const current = priceFor('zh');
  assert.equal(isCurrentPrice({ amount: 990, currency: 'cny' }, current), false);
  assert.equal(isCurrentPrice({ amount: 1499, currency: 'usd' }, current), true);
});
