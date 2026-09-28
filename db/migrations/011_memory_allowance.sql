CREATE TABLE IF NOT EXISTS memory_usage (
  user_id text PRIMARY KEY REFERENCES user_access(user_id),
  used integer NOT NULL CHECK (used BETWEEN 1 AND 10)
);
