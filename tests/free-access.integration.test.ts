import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { initializeAccess,readAccess,consumeFreeSolve } from '../src/lib/access-store';
import { createPractice,submitPractice,PracticeAccessError } from '../src/lib/practice-store';
import { database } from '../src/lib/db';

const options={skip:!process.env.RUN_DB_TESTS};
test('free solver allowances are atomic, independent, durable and isolated',options,async()=>{
 const sql=database();const id='quota_test_'+randomUUID();const other=id+'_other';
 try {
  await initializeAccess(id,Date.now());await initializeAccess(other,Date.now());
  const attempts=await Promise.all(Array.from({length:15},()=>consumeFreeSolve(id,'pipeline')));
  assert.equal(attempts.filter(x=>x!==null).length,10);
  assert.equal(await consumeFreeSolve(id,'pipeline'),null);
  assert.equal(await consumeFreeSolve(id,'numerical'),9);
  assert.equal(await consumeFreeSolve(other,'pipeline'),9);
  assert.deepEqual((await initializeAccess(id,Date.now())).solverRemaining,{pipeline:0,numerical:9,figure:10});
  await sql`UPDATE user_access SET paid_until=now()+interval '1 day' WHERE user_id=${id}`;
  assert.equal((await readAccess(id))?.status,'paid');
  await sql`UPDATE user_access SET paid_until=now()-interval '1 second' WHERE user_id=${id}`;
  assert.deepEqual((await readAccess(id))?.solverRemaining,{pipeline:0,numerical:9,figure:10});
 }finally{
  await sql`DELETE FROM solver_usage WHERE user_id IN (${id},${other})`;
  await sql`DELETE FROM user_access WHERE user_id IN (${id},${other})`;
 }
});
test('free practice generates random questions within a per-kind lifetime cap',options,async()=>{
 const sql=database();const id='samples_test_'+randomUUID();
 try {
  await initializeAccess(id,Date.now());
  const batch=await Promise.allSettled(Array.from({length:14},()=>createPractice(id,'pipeline',undefined,'hard',false)));
  const made=batch.flatMap(r=>r.status==='fulfilled'&&r.value?[r.value]:[]);
  assert.equal(made.length,10);
  assert.equal(batch.filter(r=>r.status==='rejected'&&r.reason instanceof PracticeAccessError).length,4);
  assert.ok(new Set(made.map(x=>JSON.stringify(x.question))).size>=8);
  assert.equal((await readAccess(id))?.practiceRemaining.pipeline,0);
  assert.equal((await readAccess(id))?.practiceRemaining.figure,10);
  // A question the free account already received can be redone without using a credit.
  await submitPractice(id,made[0].id,[1,2,3,4]);
  const retry=await createPractice(id,'pipeline',made[0].id,'hard',false);
  assert.deepEqual(retry?.question,made[0].question);
  const paid=await createPractice(id,'pipeline',undefined,'hard',true);
  assert.ok(paid);assert.equal(paid.question.kind==='pipeline'&&paid.question.boxes.length,3);
  await submitPractice(id,paid.id,[1,2,3,4]);
  await assert.rejects(createPractice(id,'pipeline',paid.id,'easy',false),PracticeAccessError);
 }finally{
  await sql`DELETE FROM practice_attempts WHERE user_id=${id}`;
  await sql`DELETE FROM practice_usage WHERE user_id=${id}`;
  await sql`DELETE FROM user_access WHERE user_id=${id}`;
 }
});
test('new registrations receive a 24-hour trial and old registrations cannot restart it',options,async()=>{
 const sql=database();const id='legacy_test_'+randomUUID();
 try{
  const [policy]=await sql`SELECT legacy_trial_cutoff FROM access_policy WHERE id=1`;
  const cutoff=new Date(policy.legacy_trial_cutoff).getTime();
  const old=await initializeAccess(id,cutoff-1000);
  assert.equal(old.status,cutoff-1000+86400000>Date.now()?'trial':'expired');
  const fresh=await initializeAccess(id+'_new',Math.max(Date.now(),cutoff));
  assert.equal(fresh.status,'trial');
  assert.equal(fresh.solverRemaining.pipeline,10);
 }finally{await sql`DELETE FROM user_access WHERE user_id IN (${id},${id+'_new'})`;}
});
