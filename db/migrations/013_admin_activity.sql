CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  tool text NOT NULL CHECK (tool IN ('solver:pipeline','solver:numerical','solver:figure','training:grid','training:peak')),
  action text NOT NULL CHECK (action IN ('solved','started','completed')),
  free_credits integer NOT NULL CHECK (free_credits IN (0,1)),
  source text NOT NULL CHECK (source IN ('server','client')),
  session_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id,tool,action,session_id)
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS usage_events_user_time ON usage_events(user_id,created_at DESC);
-- statement-breakpoint
ALTER TABLE practice_attempts ADD COLUMN IF NOT EXISTS free_credits integer CHECK (free_credits IN (0,1));
-- statement-breakpoint
CREATE OR REPLACE VIEW admin_activity AS
 SELECT 'usage:'||id::text AS event_id,user_id,tool,action,created_at AS occurred_at,
   free_credits,source,NULL::boolean AS correct FROM usage_events
 UNION ALL
 SELECT 'practice:start:'||id::text,user_id,'practice:'||(question->>'kind'),'started',created_at,
   free_credits,'server',NULL::boolean FROM practice_attempts
 UNION ALL
 SELECT 'practice:submit:'||id::text,user_id,'practice:'||(question->>'kind'),'completed',submitted_at,
   0,'server',correct FROM practice_attempts WHERE submitted_at IS NOT NULL
 UNION ALL
 SELECT 'exam:start:'||id::text,user_id,'exam:mock','started',created_at,
   0,'server',NULL::boolean FROM mock_exams
 UNION ALL
 SELECT 'exam:finish:'||id::text,user_id,'exam:mock','completed',finished_at,
   0,'server',NULL::boolean FROM mock_exams WHERE finished_at IS NOT NULL;
