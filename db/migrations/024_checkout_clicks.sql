-- Every signed-in checkout request, not deduplicated, with the button, page price and outcome.
CREATE TABLE IF NOT EXISTS checkout_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  source text NOT NULL CHECK (source IN ('billing','upgrade_card','other')),
  lang text NOT NULL CHECK (lang IN ('zh','en')),
  amount integer NOT NULL,
  currency text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('redirected','already_paid','processing','rate_limited','error')),
  order_id uuid,
  event_day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Australia/Sydney')::date),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS checkout_clicks_day ON checkout_clicks(event_day,created_at DESC);
