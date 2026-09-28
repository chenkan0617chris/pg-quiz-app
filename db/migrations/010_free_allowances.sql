CREATE TABLE IF NOT EXISTS access_policy (
  id integer PRIMARY KEY CHECK (id = 1),
  legacy_trial_cutoff timestamptz NOT NULL DEFAULT now()
);
-- statement-breakpoint
INSERT INTO access_policy(id) VALUES (1) ON CONFLICT (id) DO NOTHING;
-- statement-breakpoint
ALTER TABLE user_access ADD COLUMN IF NOT EXISTS trial_eligible boolean NOT NULL DEFAULT false;
-- statement-breakpoint
UPDATE user_access SET trial_eligible = true WHERE trial_started_at < (SELECT legacy_trial_cutoff FROM access_policy WHERE id=1);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS solver_usage (
  user_id text NOT NULL REFERENCES user_access(user_id),
  kind text NOT NULL CHECK (kind IN ('pipeline', 'numerical', 'figure')),
  used integer NOT NULL CHECK (used BETWEEN 0 AND 10),
  PRIMARY KEY (user_id, kind)
);
-- statement-breakpoint
ALTER TABLE practice_attempts ADD COLUMN IF NOT EXISTS sample_key text;
-- statement-breakpoint
ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_price_check;
-- statement-breakpoint
ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_price_check
 CHECK ((amount IN (300, 2990) AND currency = 'cny') OR (amount = 999 AND currency = 'usd') OR (amount IN (50, 499, 699, 990) AND currency = 'aud'));
