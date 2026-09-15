import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createPractice, submitPractice, practiceHistory } from '../src/lib/practice-store';
import { allowRequest } from '../src/lib/db';

test('database isolates users and first submission wins', {skip:!process.env.RUN_DB_TESTS}, async () => {
  const user = 'integration_'+randomUUID();
  const other = 'integration_'+randomUUID();
  const attempt = await createPractice(user,'numerical');
  assert.ok(attempt);
  assert.equal('answer' in attempt.question,false);
  assert.equal(await submitPractice(other,attempt.id,[1,2,3]),null);
  const results = await Promise.all([submitPractice(user,attempt.id,[1,2,3]),submitPractice(user,attempt.id,[3,2,1])]);
  assert.deepEqual(results[0],results[1]);
  assert.equal((await practiceHistory(user)).length,1);
  assert.equal((await practiceHistory(other)).length,0);
  assert.equal(await createPractice(other,'numerical',attempt.id),null);
  const retry=await createPractice(user,'numerical',attempt.id);
  assert.ok(retry);
  assert.notEqual(retry.id,attempt.id);
  assert.deepEqual(retry.question,attempt.question);
});

test('database request limit survives concurrent requests', {skip:!process.env.RUN_DB_TESTS}, async () => {
  const user='integration_'+randomUUID();
  const allowed=await Promise.all(Array.from({length:8},()=>allowRequest(user,'test',3)));
  assert.equal(allowed.filter(Boolean).length,3);
});
