import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestion, gradeAnswer, publicQuestion, explainQuestion } from '../src/lib/practice';

for (const [difficulty, length] of [['easy', 3], ['medium', 5], ['hard', 7]] as const) {
  test(`memory ${difficulty}: generates unique positions and grades exact order`, () => {
    const q = generateQuestion('memory', difficulty);
    assert.equal(q.kind, 'memory');
    if (q.kind !== 'memory') return;
    assert.equal(q.answer.length, length);
    assert.equal(new Set(q.answer).size, length);
    assert.ok(q.answer.every(n => Number.isInteger(n) && n >= 1 && n <= 25));
    assert.equal(gradeAnswer(q, q.answer), true);
    assert.equal(gradeAnswer(q, [...q.answer].reverse()), false);
    assert.equal(gradeAnswer(q, q.answer.slice(1)), false);
    assert.equal(gradeAnswer(q, [...q.answer, 1]), false);
    const visible = publicQuestion(q);
    assert.equal('answer' in visible, false);
    assert.equal(visible.kind, 'memory');
    if (visible.kind === 'memory') assert.deepEqual(visible.sequence, q.answer);
    assert.deepEqual(explainQuestion(q, []), { kind: 'memory', sequence: q.answer });
  });
}

test('memory fixed samples can be graded and cannot mutate the sample bank', async () => {
  const { freePracticeQuestion } = await import('../src/lib/free-practice');
  for (let index = 0; index < 5; index++) {
    const question = freePracticeQuestion('memory', index);
    assert.equal(question.kind, 'memory');
    assert.equal(gradeAnswer(question, question.answer), true);
    assert.equal(gradeAnswer(question, [...question.answer].reverse()), false);
    const original = [...question.answer];
    question.answer.reverse();
    assert.deepEqual(freePracticeQuestion('memory', index).answer, original);
  }
});

 test('memory submission accepts all 25 positions and rejects invalid payloads', async () => {
  const { practiceAnswerSchema } = await import('../src/lib/practice-answer-schema');
  assert.equal(practiceAnswerSchema.safeParse([18, 16, 25]).success, true);
  for (const answer of [[], [26], [-1], [1.5], Array(8).fill(1)]) {
    assert.equal(practiceAnswerSchema.safeParse(answer).success, false);
  }
});
