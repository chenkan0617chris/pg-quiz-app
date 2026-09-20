import test from 'node:test';
import assert from 'node:assert/strict';
import { updatePipelineDigit } from '../src/lib/practice-answer';

test('pipeline answer accepts one digit from 1 to 4 without mutating other positions', () => {
  assert.deepEqual(
    updatePipelineDigit(['', '', '', ''], 1, '3x'),
    ['', '3', '', ''],
  );
  assert.deepEqual(
    updatePipelineDigit(['1', '2', '3', '4'], 0, '9'),
    ['1', '2', '3', '4'],
  );
  assert.deepEqual(
    updatePipelineDigit(['1', '2', '3', '4'], 2, ''),
    ['1', '2', '', '4'],
  );
});
