-- Free accounts now get randomly generated questions, capped per kind instead of fixed samples.
CREATE TABLE IF NOT EXISTS practice_usage (
  user_id text NOT NULL REFERENCES user_access(user_id),
  kind text NOT NULL CHECK (kind IN ('pipeline', 'numerical', 'data', 'figure', 'grid')),
  used integer NOT NULL CHECK (used BETWEEN 1 AND 10),
  PRIMARY KEY (user_id, kind)
);
