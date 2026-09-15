CREATE TABLE IF NOT EXISTS user_access (
  user_id text PRIMARY KEY,
  trial_started_at timestamptz NOT NULL,
  trial_ends_at timestamptz NOT NULL,
  paid_until timestamptz,
  CHECK (trial_ends_at = trial_started_at + interval '7 days')
);
