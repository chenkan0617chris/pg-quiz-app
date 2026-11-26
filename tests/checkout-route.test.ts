import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import crypto from 'node:crypto';

type Click={source:string;lang:string;amount:number;currency:string;outcome:string};
const store=globalThis as unknown as {__checkoutClicks:Click[]};

async function api({paid=false,allowed=true,recorderFails=false}={}){
  const fixtures:Record<string,string>={
    '@clerk/nextjs/server':`export async function auth(){return {userId:'user_a'}}`,
    '@/lib/db':`export async function allowRequest(){return ${allowed}}export function database(){throw new Error('no db')}`,
    '@/lib/access':`export async function getAccess(){return {status:${JSON.stringify(paid?'paid':'trial')}}}`,
    '@/lib/conversion-store':`export async function recordConversion(){}`,
    '@/lib/payments':`export function paymentsEnabled(){return true}export function stripeClient(){return {}}`,
    '@/lib/checkout-clicks':`export async function recordCheckoutClick(c){globalThis.__checkoutClicks.push(c);${recorderFails?"throw new Error('log down')":''}}`,
  };
  const filter=new RegExp('^('+Object.keys(fixtures).map(k=>k.replace(/[/@.]/g,'\\$&')).join('|')+')$');
  const result=await build({entryPoints:['src/app/api/checkout/route.ts'],bundle:true,write:false,format:'cjs',platform:'node',plugins:[{name:'checkout-fixture',setup(b){
    b.onResolve({filter},args=>({path:args.path,namespace:'fixture'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:fixtures[args.path],loader:'js'}));
  }}]});
  const loaded={exports:{} as {POST:(r:Request)=>Promise<Response>}};
  new Function('module','exports','require',result.outputFiles[0].text)(loaded,loaded.exports,(id:string)=>{if(id==='node:crypto')return crypto;throw new Error('Unexpected import '+id);});
  store.__checkoutClicks=[];
  return loaded.exports;
}
const post=(body:unknown)=>new Request('http://localhost/api/checkout',{method:'POST',headers:{'Content-Type':'application/json',origin:'http://localhost'},body:JSON.stringify(body)});

test('a paid account click is logged as already_paid with its button and price',async()=>{
  const route=await api({paid:true});
  assert.equal((await route.POST(post({lang:'en',source:'billing'}))).status,409);
  assert.deepEqual(store.__checkoutClicks.map(c=>[c.source,c.lang,c.amount,c.currency,c.outcome]),[['billing','en',699,'usd','already_paid']]);
});
test('rate-limited clicks are logged and unknown buttons become other',async()=>{
  const route=await api({allowed:false});
  assert.equal((await route.POST(post({lang:'zh',source:'nope'}))).status,429);
  assert.deepEqual(store.__checkoutClicks.map(c=>[c.source,c.lang,c.amount,c.currency,c.outcome]),[['other','zh',990,'aud','rate_limited']]);
});
test('a failing click log never changes the checkout response',async()=>{
  assert.equal((await (await api({paid:true,recorderFails:true})).POST(post({lang:'en',source:'upgrade_card'}))).status,409);
  assert.equal((await (await api({allowed:false,recorderFails:true})).POST(post({lang:'en'}))).status,429);
});
test('a checkout error is logged as error',async()=>{
  const route=await api();
  assert.equal((await route.POST(post({lang:'en',source:'upgrade_card'}))).status,503);
  assert.equal(store.__checkoutClicks.at(-1)?.outcome,'error');
});
