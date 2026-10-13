import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { database } from '../src/lib/db';
import { initializeAccess, consumeFreeSolve, readAccess } from '../src/lib/access-store';
import { recordFullAccessSolve, recordTrainingActivity } from '../src/lib/activity-store';
import { createPractice, submitPractice } from '../src/lib/practice-store';
import { activityHistory, userUsage } from '../src/lib/admin/store';
import { parseActivityFilters } from '../src/lib/admin/policy';

const options={skip:!process.env.RUN_DB_TESTS};
test('admin history preserves atomic quotas, paid events, deduplication and user isolation',options,async()=>{
  const sql=database(),id=`admin_test_${randomUUID()}`,other=`admin_test_${randomUUID()}`;
  try {
    await initializeAccess(id,Date.now());
    const attempts=await Promise.all(Array.from({length:14},()=>consumeFreeSolve(id,'pipeline')));
    assert.equal(attempts.filter(value=>value!==null).length,10);
    const [log]=await sql`SELECT count(*)::int AS count,sum(free_credits)::int AS credits FROM usage_events WHERE user_id=${id}`;
    assert.equal(log.count,10);assert.equal(log.credits,10);
    await recordFullAccessSolve(id,'pipeline');
    assert.equal((await readAccess(id))?.solverRemaining.pipeline,0);
    const session=randomUUID();
    await Promise.all(Array.from({length:3},()=>recordTrainingActivity(id,'training:grid','completed',session)));
    await recordFullAccessSolve(other,'figure');
    const memory=await createPractice(id,'memory',undefined,'easy',false,0);
    assert.ok(memory);
    await submitPractice(id,memory.id,[]);
    const [usage]=await userUsage([id]);
    assert.equal(usage.solves,11);assert.equal(usage.training,1);
    assert.equal(usage.practiceStarted,1);assert.equal(usage.practiceCompleted,1);
    assert.equal(usage.quotas.find(item=>item.kind==='memory')?.used,1);
    const memoryHistory=await activityHistory(id,parseActivityFilters({tool:'practice:memory'}));
    assert.equal(memoryHistory.items.length,2);
    assert.equal(memoryHistory.items.find(item=>item.action==='started')?.freeCredits,1);
    const all=await activityHistory(id,parseActivityFilters({}));
    assert.equal(all.items.length,14);
    assert.ok(!all.items.some(item=>item.tool==='solver:figure'));
    const paid=all.items.filter(item=>item.action==='solved'&&item.freeCredits===0);
    assert.equal(paid.length,1);
    const [unused]=await userUsage(['not-a-registered-usage-user']);
    assert.equal(unused.lastActivity,null);assert.equal(unused.solves,0);
    assert.equal(unused.quotas.reduce((total,item)=>total+item.used,0),0);
  }finally{
    await sql`DELETE FROM usage_events WHERE user_id IN (${id},${other})`;
    await sql`DELETE FROM practice_attempts WHERE user_id=${id}`;
    await sql`DELETE FROM solver_usage WHERE user_id=${id}`;
    await sql`DELETE FROM memory_usage WHERE user_id=${id}`;
    await sql`DELETE FROM user_access WHERE user_id=${id}`;
  }
});
test('history supports UTC date boundaries, stable pagination and unknown historical credits',options,async()=>{
  const sql=database(),id=`admin_test_${randomUUID()}`;
  try {
    await sql`INSERT INTO usage_events(user_id,tool,action,free_credits,source,created_at)
      SELECT ${id},'solver:figure','solved',0,'server','2026-10-01T12:00:00Z'::timestamptz FROM generate_series(1,45)`;
    const one=await activityHistory(id,parseActivityFilters({from:'2026-10-01',to:'2026-10-01'}));
    const two=await activityHistory(id,parseActivityFilters({from:'2026-10-01',to:'2026-10-01',page:'2'}));
    assert.equal(one.items.length,40);assert.equal(one.hasNext,true);
    assert.equal(two.items.length,5);assert.equal(two.hasNext,false);
    assert.equal(new Set([...one.items,...two.items].map(item=>item.eventId)).size,45);
    assert.equal((await activityHistory(id,parseActivityFilters({from:'2026-10-02'}))).items.length,0);
    assert.equal((await activityHistory(id,parseActivityFilters({to:'2026-09-30'}))).items.length,0);
    await sql`INSERT INTO practice_attempts(id,user_id,question) VALUES (${randomUUID()},${id},'{"kind":"memory"}'::jsonb)`;
    const history=await activityHistory(id,parseActivityFilters({tool:'practice:memory'}));
    assert.equal(history.items[0].freeCredits,null);
  }finally{
    await sql`DELETE FROM usage_events WHERE user_id=${id}`;
    await sql`DELETE FROM practice_attempts WHERE user_id=${id}`;
  }
});
