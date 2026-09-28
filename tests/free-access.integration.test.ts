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
test('free practice never generates fresh questions or retries premium history',options,async()=>{
 const sql=database();const id='samples_test_'+randomUUID();
 try {
  const a=await createPractice(id,'pipeline',undefined,'hard',false,1);
  const b=await createPractice(id,'pipeline',undefined,'medium',false,1);
  assert.ok(a&&b);assert.deepEqual(a.question,b.question);
  assert.equal(a.sampleKey,'pipeline:1');
  await submitPractice(id,a.id,[1,2,3,4]);
  const retry=await createPractice(id,'pipeline',a.id,'hard',false);
  assert.deepEqual(retry?.question,a.question);
  const paid=await createPractice(id,'pipeline',undefined,'hard',true);
  assert.ok(paid);assert.equal(paid.sampleKey,null);
  assert.equal(paid.question.kind==='pipeline'&&paid.question.boxes.length,3);
  await submitPractice(id,paid.id,[1,2,3,4]);
  await assert.rejects(createPractice(id,'pipeline',paid.id,'easy',false),PracticeAccessError);
  await assert.rejects(createPractice(id,'pipeline',undefined,'easy',false,100));
 }finally{await sql`DELETE FROM practice_attempts WHERE user_id=${id}`;}
});
test('legacy registrations retain trial, new registrations get quotas only',options,async()=>{
 const sql=database();const id='legacy_test_'+randomUUID();
 try{
  const [policy]=await sql`SELECT legacy_trial_cutoff FROM access_policy WHERE id=1`;
  const cutoff=new Date(policy.legacy_trial_cutoff).getTime();
  const old=await initializeAccess(id,cutoff-1000);
  assert.equal(old.status,cutoff-1000+7*86400000>Date.now()?'trial':'expired');
  const fresh=await initializeAccess(id+'_new',Math.max(Date.now(),cutoff));
  assert.equal(fresh.status,'expired');
  assert.equal(fresh.solverRemaining.pipeline,10);
 }finally{await sql`DELETE FROM user_access WHERE user_id IN (${id},${id+'_new'})`;}
});
