import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { initializeAccess,readAccess } from '../src/lib/access-store';

test('database preserves trial start across retries and concurrent initialization',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const id=`test_access_${randomUUID()}`;
 const start=Date.now()-8*86400000;
 const initial=await initializeAccess(id,start);
 assert.equal(initial.status,'expired');
 const attempts=await Promise.all(Array.from({length:4},()=>initializeAccess(id,Date.now())));
 for(const attempt of attempts)assert.deepEqual(attempt,initial);
 assert.equal(await readAccess(`${id}_other`),null);
 const fresh=await initializeAccess(`${id}_fresh`,Date.now());
 assert.equal(fresh.status,'trial');
});
