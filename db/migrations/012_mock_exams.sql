CREATE TABLE IF NOT EXISTS mock_exams (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  state jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);
CREATE INDEX IF NOT EXISTS mock_exams_history ON mock_exams(user_id,created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS mock_exams_one_active ON mock_exams(user_id) WHERE finished_at IS NULL;
