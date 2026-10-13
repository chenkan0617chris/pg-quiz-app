-- Run after all migrations, against an isolated test database with psql -v ON_ERROR_STOP=1.
BEGIN;
DO $$
DECLARE uid text := 'lifetime_sql_test'; sandbox uuid := gen_random_uuid();
 live_order uuid := gen_random_uuid(); other_order uuid := gen_random_uuid(); legacy_order uuid := gen_random_uuid();
BEGIN
 INSERT INTO user_access(user_id,trial_started_at,trial_ends_at,trial_eligible)
 VALUES(uid,now()-interval '2 days',now()-interval '1 day',true);
 INSERT INTO payment_orders(id,user_id,livemode) VALUES(sandbox,uid,false);
 PERFORM fulfill_quiz_payment(sandbox,'cs_'||sandbox,'pi_'||sandbox,false);
 IF (SELECT paid_lifetime OR paid_until IS NOT NULL FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Sandbox granted live access';
 END IF;
 INSERT INTO payment_orders(id,user_id,livemode) VALUES(live_order,uid,true);
 PERFORM fulfill_quiz_payment(live_order,'cs_'||live_order,'pi_'||live_order,true);
 PERFORM fulfill_quiz_payment(live_order,'cs_'||live_order,'pi_'||live_order,true);
 IF NOT (SELECT paid_lifetime AND paid_until IS NULL FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Lifetime payment must grant non-expiring access';
 END IF;
 INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES(legacy_order,uid,true,699,'aud');
 PERFORM fulfill_quiz_payment(legacy_order,'cs_'||legacy_order,'pi_'||legacy_order,true);
 IF NOT (SELECT paid_lifetime AND paid_until=now()+interval '30 days' FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Legacy order must preserve lifetime access and its original term';
 END IF;
 INSERT INTO payment_orders(id,user_id,livemode) VALUES(other_order,uid,true);
 PERFORM fulfill_quiz_payment(other_order,'cs_'||other_order,'pi_'||other_order,true);
 PERFORM refund_quiz_payment('pi_'||live_order,true);
 IF NOT (SELECT paid_lifetime FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Refund revoked another valid lifetime purchase';
 END IF;
 PERFORM refund_quiz_payment('pi_'||other_order,true);
 IF (SELECT paid_lifetime FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Refund did not revoke lifetime access';
 END IF;
 IF NOT (SELECT paid_until=now()+interval '30 days' FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Refund revoked valid legacy purchase';
 END IF;
 PERFORM refund_quiz_payment('pi_'||legacy_order,true);
 PERFORM fulfill_quiz_payment(live_order,'cs_'||live_order,'pi_'||live_order,true);
 IF (SELECT paid_lifetime OR paid_until IS NOT NULL FROM user_access WHERE user_id=uid) THEN
  RAISE EXCEPTION 'Duplicate fulfillment resurrected refunded access';
 END IF;
END;
$$;
ROLLBACK;
