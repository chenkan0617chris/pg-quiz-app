-- Chinese pages sell the 7-day pass for A$9.90 so an Australian Stripe account can offer
-- Alipay and WeChat Pay, which it does not offer in USD. A$9.90 is already an allowed
-- order price; this makes it grant 168 hours instead of the old 30-day default.
-- Older AUD prices keep their previous grants.
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
  WHEN (purchase.amount=990 AND purchase.currency IN ('cny','aud')) OR (purchase.amount IN (699,1499) AND purchase.currency='usd') THEN now()+interval '168 hours'
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
