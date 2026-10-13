-- Keep old trial promises and old order entitlements intact.
ALTER TABLE user_access DROP CONSTRAINT IF EXISTS user_access_check;
-- statement-breakpoint
UPDATE user_access SET trial_ends_at=trial_started_at+interval '24 hours',trial_eligible=true WHERE NOT trial_eligible;
-- statement-breakpoint
ALTER TABLE user_access ADD COLUMN IF NOT EXISTS paid_lifetime boolean NOT NULL DEFAULT false;
-- statement-breakpoint
ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS granted_lifetime boolean NOT NULL DEFAULT false;
-- statement-breakpoint
ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_price_check;
-- statement-breakpoint
ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_price_check
 CHECK ((amount IN (300, 1990, 2990) AND currency = 'cny') OR (amount = 999 AND currency = 'usd') OR (amount IN (50, 499, 699, 990) AND currency = 'aud'));
-- statement-breakpoint
ALTER TABLE payment_orders ALTER COLUMN amount SET DEFAULT 1990;
-- statement-breakpoint
ALTER TABLE payment_orders ALTER COLUMN currency SET DEFAULT 'cny';
-- statement-breakpoint
CREATE OR REPLACE FUNCTION fulfill_quiz_payment(order_key uuid, session_key text, intent_key text, is_live boolean) RETURNS void AS $$
DECLARE purchase payment_orders; expiry timestamptz; lifetime boolean;
BEGIN
 SELECT * INTO purchase FROM payment_orders WHERE id=order_key FOR UPDATE;
 IF NOT FOUND OR purchase.livemode<>is_live OR (purchase.session_id IS NOT NULL AND purchase.session_id<>session_key) THEN
  RAISE EXCEPTION 'Payment order mismatch';
 END IF;
 IF purchase.status IN ('paid','refunded') THEN RETURN; END IF;
 PERFORM 1 FROM user_access WHERE user_id=purchase.user_id FOR UPDATE;
 lifetime := purchase.amount=1990 AND purchase.currency='cny';
 expiry := CASE WHEN lifetime THEN NULL ELSE now()+interval '30 days' END;
 UPDATE payment_orders SET status='paid',session_id=session_key,payment_intent=intent_key,
  granted_until=expiry,granted_lifetime=lifetime WHERE id=order_key;
 IF is_live THEN
  UPDATE user_access SET paid_lifetime=paid_lifetime OR lifetime,
   paid_until=CASE WHEN lifetime THEN paid_until ELSE greatest(paid_until,expiry) END
   WHERE user_id=purchase.user_id;
 END IF;
END;
$$ LANGUAGE plpgsql;
-- statement-breakpoint
CREATE OR REPLACE FUNCTION refund_quiz_payment(intent_key text, is_live boolean) RETURNS void AS $$
DECLARE purchase payment_orders;
BEGIN
 SELECT * INTO purchase FROM payment_orders WHERE payment_intent=intent_key FOR UPDATE;
 IF NOT FOUND OR purchase.livemode<>is_live THEN RETURN; END IF;
 PERFORM 1 FROM user_access WHERE user_id=purchase.user_id FOR UPDATE;
 UPDATE payment_orders SET status='refunded' WHERE id=purchase.id;
 IF is_live THEN
  UPDATE user_access SET
   paid_until=(SELECT max(granted_until) FROM payment_orders WHERE user_id=purchase.user_id AND livemode=true AND status='paid'),
   paid_lifetime=EXISTS(SELECT 1 FROM payment_orders WHERE user_id=purchase.user_id AND livemode=true AND status='paid' AND granted_lifetime)
   WHERE user_id=purchase.user_id;
 END IF;
END;
$$ LANGUAGE plpgsql;
