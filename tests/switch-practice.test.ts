import test from 'node:test';
import assert from 'node:assert/strict';
import { SWITCH_QUESTIONS, switchOutput, switchRows, unknownSpan } from '../src/content/switch-practice';
import { apply, isPermutation } from '../src/lib/engine';

test('each free Switch question has exactly one option that produces the output', () => {
  assert.equal(SWITCH_QUESTIONS.length, 8);
  for (const q of SWITCH_QUESTIONS) {
    assert.equal(q.boxes.filter(b => b === null).length, 1, q.id);
    assert.equal(q.options.length, 4, q.id);
    assert.equal(new Set(q.options.map(o => o.join(''))).size, 4, q.id);
    for (const o of q.options) assert.ok(isPermutation(o), `${q.id} ${o}`);
    const out = switchOutput(q).join('');
    const working = q.options.filter(o => switchRows(q, o).at(-1)!.join('') === out);
    assert.deepEqual(working, [q.answer], q.id);
    // The output must differ from the input, otherwise the question is trivial.
    assert.notEqual(out, q.input.join(''), q.id);
  }
});

test('the unknown span maps exactly through the answer', () => {
  for (const q of SWITCH_QUESTIONS) {
    const { from, to } = unknownSpan(q);
    assert.deepEqual(apply(q.answer, from), to, q.id);
  }
});
