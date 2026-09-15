import { neon } from '@neondatabase/serverless';

export function database() {
  if (!process.env.DATABASE_URL) throw new Error('Database is not configured');
  return neon(process.env.DATABASE_URL);
}

/** A shared database limit works across separate serverless instances. */
export async function allowRequest(userId:string,action:string,limit=30):Promise<boolean> {
  const sql=database();
  const [row]=await sql`
    INSERT INTO request_limits(user_id,action) VALUES (${userId},${action})
    ON CONFLICT (user_id,action) DO UPDATE SET
      count=CASE WHEN request_limits.window_start < now()-interval '1 minute' THEN 1 ELSE request_limits.count+1 END,
      window_start=CASE WHEN request_limits.window_start < now()-interval '1 minute' THEN now() ELSE request_limits.window_start END
    RETURNING count`;
  return Number(row.count)<=limit;
}
