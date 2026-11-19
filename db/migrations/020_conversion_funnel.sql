CREATE TABLE IF NOT EXISTS conversion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES user_access(user_id),
  event text NOT NULL CHECK (event IN ('mock_paywall_viewed','checkout_started','payment_completed')),
  event_day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Australia/Sydney')::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id,event,event_day)
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS conversion_events_day_event ON conversion_events(event_day,event,user_id);
