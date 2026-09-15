-- statement-breakpoint
-- A purchase starts 30 paid days immediately; unused trial time is not added.
-- Existing grants remain unchanged and duplicate notifications remain idempotent.
CREATE OR REPLACE FUNCTION fulfill_quiz_payment(order_key uuid, session_key text, intent_key text, is_live boolean) RETURNS void AS $$
DECLARE purchase payment_orders; expiry timestamptz;
BEGIN
 SELECT * INTO purchase FROM payment_orders WHERE id=order_key FOR UPDATE;
 IF NOT FOUND OR purchase.livemode<>is_live OR (purchase.session_id IS NOT NULL AND purchase.session_id<>session_key) THEN
  RAISE EXCEPTION 'Payment order mismatch';
 END IF;
 IF purchase.status IN ('paid','refunded') THEN RETURN; END IF;
 PERFORM 1 FROM user_access WHERE user_id=purchase.user_id FOR UPDATE;
 expiry := now()+interval '30 days';
 UPDATE payment_orders SET status='paid',session_id=session_key,payment_intent=intent_key,granted_until=expiry WHERE id=order_key;
 IF is_live THEN UPDATE user_access SET paid_until=expiry WHERE user_id=purchase.user_id; END IF;
END;
$$ LANGUAGE plpgsql;
