CREATE TABLE IF NOT EXISTS payment_orders (
 id uuid PRIMARY KEY,
 user_id text NOT NULL REFERENCES user_access(user_id),
 livemode boolean NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','refunded','expired')),
 amount integer NOT NULL DEFAULT 2990 CHECK(amount=2990),
 currency text NOT NULL DEFAULT 'cny' CHECK(currency='cny'),
 session_id text UNIQUE,
 payment_intent text UNIQUE,
 granted_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
 );
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS one_pending_payment ON payment_orders(user_id,livemode) WHERE status='pending';
-- statement-breakpoint
CREATE OR REPLACE FUNCTION fulfill_quiz_payment(order_key uuid, session_key text, intent_key text, is_live boolean) RETURNS void AS $$
DECLARE purchase payment_orders; expiry timestamptz;
BEGIN
 SELECT * INTO purchase FROM payment_orders WHERE id=order_key FOR UPDATE;
 IF NOT FOUND OR purchase.livemode<>is_live OR (purchase.session_id IS NOT NULL AND purchase.session_id<>session_key) THEN
  RAISE EXCEPTION 'Payment order mismatch';
 END IF;
 IF purchase.status IN ('paid','refunded') THEN RETURN; END IF;
 PERFORM 1 FROM user_access WHERE user_id=purchase.user_id FOR UPDATE;
 SELECT greatest(now(),trial_ends_at,coalesce(paid_until,now()))+interval '30 days' INTO expiry FROM user_access WHERE user_id=purchase.user_id;
 UPDATE payment_orders SET status='paid',session_id=session_key,payment_intent=intent_key,granted_until=expiry WHERE id=order_key;
 IF is_live THEN UPDATE user_access SET paid_until=expiry WHERE user_id=purchase.user_id; END IF;
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
  UPDATE user_access SET paid_until=(SELECT max(granted_until) FROM payment_orders WHERE user_id=purchase.user_id AND livemode=true AND status='paid') WHERE user_id=purchase.user_id;
 END IF;
END;
$$ LANGUAGE plpgsql;
