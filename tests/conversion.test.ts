import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';

async function api(userId:string|null,allowed=true){
  const result=await build({entryPoints:['src/app/api/conversion/route.ts'],bundle:true,write:false,format:'cjs',platform:'node',plugins:[{name:'conversion-fixture',setup(b){
    b.onResolve({filter:/^(@clerk\/nextjs\/server|@\/lib\/(db|conversion-store))$/},args=>({path:args.path,namespace:'fixture'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='@clerk/nextjs/server'?`export async function auth(){return {userId:${JSON.stringify(userId)}}}`:args.path==='@/lib/db'?`export async function allowRequest(){return ${allowed}}`:`export const CONVERSION_EVENTS=['mock_paywall_viewed','upgrade_prompt_viewed','pricing_viewed','checkout_started','payment_completed'];export const CLIENT_CONVERSION_EVENTS=['mock_paywall_viewed','upgrade_prompt_viewed','pricing_viewed'];export const calls=[];export async function recordConversion(...args){calls.push(args)}`,loader:'js'}));
  }}]});
  const loaded={exports:{} as {POST:(r:Request)=>Promise<Response>}};
  new Function('module','exports','require',result.outputFiles[0].text)(loaded,loaded.exports,()=>{throw new Error('Unexpected external import');});
  return loaded.exports;
}
const post=(body:unknown)=>new Request('http://localhost/api/conversion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

test('conversion route only accepts authenticated client-side funnel views',async()=>{
  const guest=await api(null);
  assert.equal((await guest.POST(post({event:'mock_paywall_viewed'}))).status,401);
  const member=await api('user');
  assert.equal((await member.POST(post({event:'checkout_started'}))).status,400);
  assert.equal((await member.POST(post({event:'payment_completed'}))).status,400);
  assert.equal((await member.POST(post({event:'mock_paywall_viewed'}))).status,204);
  assert.equal((await member.POST(post({event:'upgrade_prompt_viewed'}))).status,204);
  assert.equal((await member.POST(post({event:'pricing_viewed'}))).status,204);
});

test('event lists match the database constraint',()=>{
  const store=readFileSync('src/lib/conversion-store.ts','utf8');
  const migration=readFileSync('db/migrations/021_pricing_view_events.sql','utf8');
  for(const event of ['mock_paywall_viewed','upgrade_prompt_viewed','pricing_viewed','checkout_started','payment_completed']){
    assert.match(store,new RegExp(`'${event}'`));assert.match(migration,new RegExp(`'${event}'`));
  }
});

test('conversion route rate limits repeated paywall events',async()=>{
  const throttled=await api('user',false);
  assert.equal((await throttled.POST(post({event:'mock_paywall_viewed'}))).status,429);
});

test('server milestones are written only after a usable checkout and non-refunded payment',()=>{
  const checkout=readFileSync('src/app/api/checkout/route.ts','utf8');
  assert.match(checkout,/return checkoutResponse\(userId,existing\.url\)/);
  assert.match(checkout,/return checkoutResponse\(userId,session\.url\)/);
  const webhook=readFileSync('src/app/api/stripe/webhook/route.ts','utf8');
  assert.match(webhook,/const refunded=[\s\S]*latest_charge[\s\S]*refunded/);
  assert.match(webhook,/if\(refunded\)[\s\S]*refund_quiz_payment[\s\S]*else if\(session\.livemode\)await recordConversion/);
});
