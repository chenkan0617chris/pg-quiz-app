import { readFileSync, readdirSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
const directory=new URL('../db/migrations/',import.meta.url);
for(const file of readdirSync(directory).filter(f=>f.endsWith('.sql')).sort()) {
 const migration=readFileSync(new URL(file,directory),'utf8');
 await sql.transaction(migration.split(migration.includes('-- statement-breakpoint')?'-- statement-breakpoint':';').map(s=>s.trim()).filter(Boolean).map(s=>sql.query(s)));
 console.log(`Applied ${file}`);
}
