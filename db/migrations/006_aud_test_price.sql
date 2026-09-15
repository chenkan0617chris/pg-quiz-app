ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_price_check;
-- statement-breakpoint
ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_price_check
 CHECK ((amount = 2990 AND currency = 'cny') OR (amount = 999 AND currency = 'usd') OR (amount = 50 AND currency = 'aud'));
