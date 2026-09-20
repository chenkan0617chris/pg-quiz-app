import test from 'node:test';
import assert from 'node:assert/strict';
import { solvePuzzle } from '../src/lib/engine';

test('a single unknown stage can be solved with all three candidate slots empty', () => {
  const result = solvePuzzle({
    inputUnknown: false,
    outputUnknown: false,
    inputOrder: [1, 2, 3, 4],
    outputOrder: [4, 3, 2, 1],
    boxes: [{ value: '', unknown: true, candidates: ['', '', ''] }],
    candidates: '',
  });

  assert.equal(result.kind, 'singleBox');
  if (result.kind !== 'singleBox') return;
  assert.deepEqual(result.box, [4, 3, 2, 1]);
  assert.deepEqual(result.candidates, []);
});

test('multiple unknown stages choose from each stage own candidate slots', () => {
  const result = solvePuzzle({
    inputUnknown: false,
    outputUnknown: false,
    inputOrder: [1, 2, 3, 4],
    outputOrder: [4, 3, 2, 1],
    boxes: [
      { value: '', unknown: true, candidates: ['2143', '1234', '1243'] },
      { value: '', unknown: true, candidates: ['3412', '1234', '1324'] },
    ],
    candidates: '',
  });

  assert.equal(result.kind, 'multiBox');
  if (result.kind !== 'multiBox') return;
  assert.deepEqual(result.solutions, [[
    { boxIndex: 0, box: [2, 1, 4, 3] },
    { boxIndex: 1, box: [3, 4, 1, 2] },
  ]]);
});

test('multiple unknown stages require all three candidates for every stage', () => {
  const result = solvePuzzle({
    inputUnknown: false,
    outputUnknown: false,
    inputOrder: [1, 2, 3, 4],
    outputOrder: [4, 3, 2, 1],
    boxes: [
      { value: '', unknown: true, candidates: ['2143', '', ''] },
      { value: '', unknown: true, candidates: ['3412', '1234', '1324'] },
    ],
    candidates: '',
  });

  assert.deepEqual(result, {
    kind: 'errors',
    errors: [{ key: 'needCands', params: [2] }],
  });
});
