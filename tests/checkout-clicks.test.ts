import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutSource, internalUserIds } from '../src/lib/checkout-click-policy';

test('checkout source accepts only known buttons',()=>{
  assert.equal(checkoutSource('billing'),'billing');
  assert.equal(checkoutSource('upgrade_card'),'upgrade_card');
  for(const value of ['x',undefined,null,1,'Billing'])assert.equal(checkoutSource(value),'other');
});
test('internal ids merge env lists and ignore blanks',()=>{
  assert.deepEqual(internalUserIds(' a, b','',undefined,'b'),['a','b']);
  assert.deepEqual(internalUserIds(undefined,' , '),[]);
});
