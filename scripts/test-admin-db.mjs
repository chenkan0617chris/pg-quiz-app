// Runs database tests in a disposable database, never in the application's database.
import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
nextEnv.loadEnvConfig(process.cwd());
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL required');
const schema=`admin_check_${randomUUID().replaceAll('-','')}`;
const base=neon(process.env.DATABASE_URL);
await base.query(`CREATE DATABASE "${schema}"`);
try {
  const url=new URL(process.env.DATABASE_URL);
  url.pathname=`/${schema}`;
  const sql=neon(url.toString());
  const [context]=await sql`SELECT current_database() AS schema`;
  if(context.schema!==schema)throw new Error('Refusing to test outside isolated database');
  for(const file of readdirSync('db/migrations').filter(f=>f.endsWith('.sql')).sort()) {
    const source=readFileSync(`db/migrations/${file}`,'utf8');
    await sql.transaction(source.split(source.includes('-- statement-breakpoint')?'-- statement-breakpoint':';').map(s=>s.trim()).filter(Boolean).map(s=>sql.query(s)));
  }
  console.log('Isolated database prepared. Running database tests.');
  const files=process.argv.slice(2);
  if(!files.length)files.push(...readdirSync('tests').filter(f=>f.endsWith('.integration.test.ts')).map(f=>`tests/${f}`));
  const result=spawnSync(process.execPath,['--import','tsx','--test',...files],{stdio:'inherit',env:{...process.env,DATABASE_URL:url.toString(),RUN_DB_TESTS:'1'}});
  process.exitCode=result.status??1;
}finally{
  await base.query(`DROP DATABASE "${schema}" WITH (FORCE)`);
  console.log('Isolated test database removed.');
}
