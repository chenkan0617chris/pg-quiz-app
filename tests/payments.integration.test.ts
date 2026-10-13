import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { database } from '../src/lib/db';
import { initializeAccess,readAccess } from '../src/lib/access-store';
test('buying during a trial grants lifetime access immediately',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_trial_test_'+randomUUID();const order=randomUUID();
 try{
  await initializeAccess(uid,Date.now());
  await sql`UPDATE user_access SET trial_eligible=true WHERE user_id=${uid}`;
  const trial=await readAccess(uid);
  assert.equal(trial?.status,'trial');
  await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${order},${uid},true,1990,'cny')`;
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  const access=await readAccess(uid);
  assert.equal(access?.status,'paid');
  assert.equal(access?.lifetime,true);
  assert.equal(access?.paidUntil,null);
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  assert.equal((await readAccess(uid))?.lifetime,true,'duplicate webhook preserves lifetime access');
 }finally{
  await sql`DELETE FROM payment_orders WHERE user_id=${uid}`;
  await sql`DELETE FROM user_access WHERE user_id=${uid}`;
 }
});
test('payment fulfillment is idempotent, refunds revoke, and sandbox cannot grant live access',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_test_'+randomUUID();
 await initializeAccess(uid,Date.now()-8*86400000);
 const testOrder=randomUUID();
 await sql`INSERT INTO payment_orders(id,user_id,livemode) VALUES (${testOrder},${uid},false)`;
 await sql`SELECT fulfill_quiz_payment(${testOrder}::uuid,${'cs_'+testOrder},${'pi_'+testOrder},false)`;
 assert.equal((await readAccess(uid))?.status,'expired');
 const liveOrder=randomUUID();
 await sql`INSERT INTO payment_orders(id,user_id,livemode) VALUES (${liveOrder},${uid},true)`;
 await Promise.all(Array.from({length:3},()=>sql`SELECT fulfill_quiz_payment(${liveOrder}::uuid,${'cs_'+liveOrder},${'pi_'+liveOrder},true)`));
 const granted=await readAccess(uid);
 assert.equal(granted?.status,'paid');
 assert.equal(granted?.lifetime,true);
 assert.equal(granted?.paidUntil,null);
 await sql`SELECT refund_quiz_payment(${'pi_'+liveOrder},true)`;
 assert.equal((await readAccess(uid))?.status,'expired');
 await sql`SELECT fulfill_quiz_payment(${liveOrder}::uuid,${'cs_'+liveOrder},${'pi_'+liveOrder},true)`;
 assert.equal((await readAccess(uid))?.status,'expired');
 await assert.rejects(sql`SELECT fulfill_quiz_payment(${testOrder}::uuid,'wrong','wrong',true)`);
});
