import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {database} from '../src/lib/db';
import {initializeAccess,readAccess} from '../src/lib/access-store';
import {createPractice,submitPractice,practiceUsage,PracticeAccessError} from '../src/lib/practice-store';

test('memory lifetime allowance caps concurrent starts, preserves access and scopes usage', {skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const id='memory_quota_test_'+randomUUID();const other=id+'_other';
 try{
  await initializeAccess(id,Date.now());await initializeAccess(other,Date.now());
  await assert.rejects(createPractice(id,'memory',undefined,'easy',false,99));
  assert.equal((await readAccess(id))?.memoryRemaining,10);
  const first=await createPractice(id,'memory',undefined,'easy',false,0);assert.ok(first);
  assert.equal(await createPractice(id,'memory',randomUUID(),'easy',false),null);
  const batch=await Promise.allSettled(Array.from({length:14},()=>createPractice(id,'memory',undefined,'easy',false,1)));
  assert.equal(batch.filter(r=>r.status==='fulfilled').length,9);
  assert.equal(batch.filter(r=>r.status==='rejected'&&r.reason instanceof PracticeAccessError).length,5);
  assert.equal((await readAccess(id))?.memoryRemaining,0);
  assert.equal((await initializeAccess(id,Date.now())).memoryRemaining,0);
  assert.equal((await readAccess(other))?.memoryRemaining,10);
  assert.equal((await readAccess(id))?.solverRemaining.pipeline,10);
  await submitPractice(id,first.id,[1,2,3]);
  await assert.rejects(createPractice(id,'memory',first.id,'easy',false),PracticeAccessError);
  // Existing rounds still submit/review after the last credit, but retry costs a round.
  assert.ok(await submitPractice(id,first.id,[1,2,3]));
  const paid=await createPractice(id,'memory',undefined,'hard',true);assert.ok(paid);
  assert.equal((await readAccess(id))?.memoryRemaining,0);
  await createPractice(id,'pipeline',undefined,'easy',false);
  assert.equal((await practiceUsage(id)).memory.started,11);
  assert.equal((await practiceUsage(id)).memory.completed,1);
  assert.deepEqual(await practiceUsage(other),{});
  const freshPaid=await createPractice(other,'memory',undefined,'hard',true);assert.ok(freshPaid);
  assert.equal((await readAccess(other))?.memoryRemaining,10);
  await submitPractice(other,freshPaid.id,[1,2,3]);
  await assert.rejects(createPractice(other,'pipeline',freshPaid.id,'easy',false),PracticeAccessError);
  assert.equal((await readAccess(other))?.memoryRemaining,10);
 }finally{
  await sql`DELETE FROM practice_attempts WHERE user_id IN (${id},${other})`;
  await sql`DELETE FROM memory_usage WHERE user_id IN (${id},${other})`;
  await sql`DELETE FROM user_access WHERE user_id IN (${id},${other})`;
 }
});
