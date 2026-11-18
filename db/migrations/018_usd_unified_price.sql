-- New purchases use one USD price regardless of the language shown in the app.
-- Historical CNY and AUD values remain valid so completed, pending and refunded
-- orders can still be reconciled safely.
ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_price_check;
-- statement-breakpoint
ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_price_check
 CHECK ((amount IN (300, 990, 1990, 2990) AND currency = 'cny') OR (amount IN (999, 1499) AND currency = 'usd') OR (amount IN (50, 499, 699, 990) AND currency = 'aud'));
-- statement-breakpoint
ALTER TABLE payment_orders ALTER COLUMN amount SET DEFAULT 1499;
-- statement-breakpoint
ALTER TABLE payment_orders ALTER COLUMN currency SET DEFAULT 'usd';
