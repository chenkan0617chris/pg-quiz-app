CREATE TABLE IF NOT EXISTS practice_attempts (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  question jsonb NOT NULL,
  answer jsonb,
  correct boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  CHECK ((submitted_at IS NULL AND answer IS NULL AND correct IS NULL)
    OR (submitted_at IS NOT NULL AND answer IS NOT NULL AND correct IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS practice_user_history ON practice_attempts(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS request_limits (
  user_id text NOT NULL,
  action text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, action)
);
