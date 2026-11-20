import assert from 'node:assert/strict';
import test from 'node:test';
import { PRACTICE_NAVIGATION } from '../src/lib/practice-navigation';

test('Practice contains every exercise in the expected demand order', () => {
  assert.deepEqual(
    PRACTICE_NAVIGATION.map(item => item.path),
    [
      '/practice',
      '/practice?kind=numerical',
      '/practice?kind=figure',
      '/memory',
      '/grid',
      '/practice?kind=data',
      '/peak',
      '/verbal',
    ],
  );
});
