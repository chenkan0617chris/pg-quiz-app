-- English pages charge USD 14.99 for seven days; Chinese pages keep CNY 9.90.
-- Historical prices keep their terms.
ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_price_check;
-- statement-breakpoint
ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_price_check
 CHECK ((amount IN (300, 990, 1990, 2990) AND currency = 'cny') OR (amount IN (999, 1499) AND currency = 'usd') OR (amount IN (50, 499, 699, 990) AND currency = 'aud'));
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
 expiry := CASE
  WHEN lifetime THEN NULL
  WHEN (purchase.amount=990 AND purchase.currency='cny') OR (purchase.amount=1499 AND purchase.currency='usd') THEN now()+interval '168 hours'
  ELSE now()+interval '30 days'
 END;
 UPDATE payment_orders SET status='paid',session_id=session_key,payment_intent=intent_key,
  granted_until=expiry,granted_lifetime=lifetime WHERE id=order_key;
 IF is_live THEN
  UPDATE user_access SET paid_lifetime=paid_lifetime OR lifetime,
   paid_until=CASE WHEN lifetime THEN paid_until ELSE greatest(paid_until,expiry) END
   WHERE user_id=purchase.user_id;
 END IF;
END;
$$ LANGUAGE plpgsql;
