import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { database } from '../src/lib/db';
import { initializeAccess,readAccess } from '../src/lib/access-store';
test('buying from the free plan grants seven days immediately',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_trial_test_'+randomUUID();const order=randomUUID();
 try{
  await initializeAccess(uid,Date.now());
  assert.equal((await readAccess(uid))?.status,'expired');
  await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${order},${uid},true,990,'cny')`;
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  const access=await readAccess(uid);
  assert.equal(access?.status,'paid');
  assert.equal(access?.lifetime,false);
  assert.ok(Math.abs(Date.parse(access!.paidUntil!)-Date.now()-7*86400000)<5000);
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  assert.equal((await readAccess(uid))?.paidUntil,access?.paidUntil,'duplicate webhook does not restart seven days');
  await sql`UPDATE user_access SET paid_until=now()-interval '1 second' WHERE user_id=${uid}`;
  await sql`UPDATE user_access SET trial_ends_at=now()-interval '1 second' WHERE user_id=${uid}`;
  assert.equal((await readAccess(uid))?.status,'expired');
 }finally{
  await sql`DELETE FROM payment_orders WHERE user_id=${uid}`;
  await sql`DELETE FROM user_access WHERE user_id=${uid}`;
 }
});
test('payment fulfillment is idempotent, refunds revoke, and sandbox cannot grant live access',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_test_'+randomUUID();
 try{
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
 assert.equal(granted?.lifetime,false);
 assert.ok(Math.abs(Date.parse(granted!.paidUntil!)-Date.now()-7*86400000)<5000);
 await sql`SELECT refund_quiz_payment(${'pi_'+liveOrder},true)`;
 assert.equal((await readAccess(uid))?.status,'expired');
 await sql`SELECT fulfill_quiz_payment(${liveOrder}::uuid,${'cs_'+liveOrder},${'pi_'+liveOrder},true)`;
 assert.equal((await readAccess(uid))?.status,'expired');
 await assert.rejects(sql`SELECT fulfill_quiz_payment(${testOrder}::uuid,'wrong','wrong',true)`);
 }finally{
  await sql`DELETE FROM payment_orders WHERE user_id=${uid}`;
  await sql`DELETE FROM user_access WHERE user_id=${uid}`;
 }
});
test('USD 6.99 checkout grants seven days and refunds revoke it',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_usd699_test_'+randomUUID();const order=randomUUID();
 try{
  await initializeAccess(uid,Date.now()-8*86400000);
  await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${order},${uid},true,699,'usd')`;
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  const access=await readAccess(uid);
  assert.equal(access?.status,'paid');
  assert.equal(access?.lifetime,false);
  assert.ok(Math.abs(Date.parse(access!.paidUntil!)-Date.now()-7*86400000)<5000);
  await sql`SELECT refund_quiz_payment(${'pi_'+order},true)`;
  assert.equal((await readAccess(uid))?.status,'expired');
  await assert.rejects(sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${randomUUID()},${uid},true,1500,'usd')`);
 }finally{
  await sql`DELETE FROM payment_orders WHERE user_id=${uid}`;
  await sql`DELETE FROM user_access WHERE user_id=${uid}`;
 }
});
test('AUD 9.90 checkout grants seven days',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_aud990_test_'+randomUUID();const order=randomUUID();
 try{
  await initializeAccess(uid,Date.now()-8*86400000);
  await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${order},${uid},true,990,'aud')`;
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  const access=await readAccess(uid);
  assert.equal(access?.status,'paid');
  assert.equal(access?.lifetime,false);
  assert.ok(Math.abs(Date.parse(access!.paidUntil!)-Date.now()-7*86400000)<5000);
  await sql`SELECT refund_quiz_payment(${'pi_'+order},true)`;
  assert.equal((await readAccess(uid))?.status,'expired');
  await assert.rejects(sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${randomUUID()},${uid},true,1000,'aud')`);
 }finally{
  await sql`DELETE FROM payment_orders WHERE user_id=${uid}`;
  await sql`DELETE FROM user_access WHERE user_id=${uid}`;
 }
});
test('legacy USD 14.99 checkout still grants seven days',{skip:!process.env.RUN_DB_TESTS},async()=>{
 const sql=database();const uid='payment_usd_test_'+randomUUID();const order=randomUUID();
 try{
  await initializeAccess(uid,Date.now()-8*86400000);
  await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${order},${uid},true,1499,'usd')`;
  await sql`SELECT fulfill_quiz_payment(${order}::uuid,${'cs_'+order},${'pi_'+order},true)`;
  const access=await readAccess(uid);
  assert.equal(access?.status,'paid');
  assert.equal(access?.lifetime,false);
  assert.ok(Math.abs(Date.parse(access!.paidUntil!)-Date.now()-7*86400000)<5000);
  await sql`SELECT refund_quiz_payment(${'pi_'+order},true)`;
  assert.equal((await readAccess(uid))?.status,'expired');
  await assert.rejects(sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${randomUUID()},${uid},true,1500,'usd')`);
 }finally{
  await sql`DELETE FROM payment_orders WHERE user_id=${uid}`;
  await sql`DELETE FROM user_access WHERE user_id=${uid}`;
 }
});
