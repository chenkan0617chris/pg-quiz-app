import test from 'node:test';
import assert from 'node:assert/strict';
import { allowanceState } from '../src/lib/allowance';

const free = { status: 'expired' as const };

test('guests and members never see an allowance notice', () => {
  assert.equal(allowanceState({ account: null, remaining: undefined, limited: false }), 'hidden');
  assert.equal(allowanceState({ account: { status: 'paid' }, remaining: 0, limited: false }), 'hidden');
  // Paid in another tab after the server refused: the refreshed account wins over the old refusal.
  assert.equal(allowanceState({ account: { status: 'paid' }, remaining: 0, limited: true }), 'hidden');
});

test('free accounts are warned at three left and stopped at zero', () => {
  assert.equal(allowanceState({ account: free, remaining: 10, limited: false }), 'ok');
  assert.equal(allowanceState({ account: free, remaining: 4, limited: false }), 'ok');
  assert.equal(allowanceState({ account: free, remaining: 3, limited: false }), 'low');
  assert.equal(allowanceState({ account: free, remaining: 1, limited: false }), 'low');
  assert.equal(allowanceState({ account: free, remaining: 0, limited: false }), 'empty');
  assert.equal(allowanceState({ account: free, remaining: -1, limited: false }), 'empty');
});

test('a refusal with allowance left is a member-only item, not a used-up allowance', () => {
  assert.equal(allowanceState({ account: free, remaining: 6, limited: true }), 'locked');
  assert.equal(allowanceState({ account: free, remaining: 0, limited: true }), 'empty');
  assert.equal(allowanceState({ account: null, remaining: undefined, limited: true }), 'locked');
});

test('a missing count is not treated as used up', () => {
  assert.equal(allowanceState({ account: free, remaining: undefined, limited: false }), 'hidden');
});
