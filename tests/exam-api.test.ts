import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { randomUUID } from 'node:crypto';

async function api(userId:string|null,status:string){
  const result=await build({entryPoints:['src/app/api/exams/route.ts'],bundle:true,write:false,format:'cjs',platform:'node',plugins:[{name:'auth-fixture',setup(b){
    b.onResolve({filter:/^(@clerk\/nextjs\/server|@\/lib\/(access|db|exam-store))$/},args=>({path:args.path,namespace:'fixture'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='@clerk/nextjs/server'?`export async function auth(){return {userId:${JSON.stringify(userId)}}}`:args.path==='@/lib/access'?`export async function getAccess(){return {status:${JSON.stringify(status)}}}`:args.path==='@/lib/db'?'export async function allowRequest(){return true}':`export async function createExam(){return {ok:true}};export async function updateExam(){return {ok:true}};export async function listExams(){return []};export async function getExamReport(){return {ok:true}}`,loader:'js'}));
  }}]});
  const loaded={exports:{} as {GET:(r:Request)=>Promise<Response>;POST:(r:Request)=>Promise<Response>}};
  new Function('module','exports','require',result.outputFiles[0].text)(loaded,loaded.exports,()=>{throw new Error('Unexpected external import');});
  return loaded.exports;
}
const post=(body:unknown)=>new Request('http://localhost/api/exams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
test('exam route requires server authentication and membership for exam access',async()=>{
  const guest=await api(null,'paid');
  assert.equal((await guest.GET(new Request('http://localhost/api/exams'))).status,401);
  assert.equal((await guest.POST(post({action:'create'}))).status,401);
  const free=await api('user','expired');
  for(const body of [{action:'create',status:'paid'},{action:'begin',id:randomUUID(),section:0},{action:'sync',id:randomUUID()},{action:'answer',id:randomUUID(),questionId:randomUUID(),answer:[1,2,3,4]}])assert.equal((await free.POST(post(body))).status,403);
  assert.equal((await free.POST(post({action:'finish',id:randomUUID()}))).status,200);
  assert.equal((await free.GET(new Request('http://localhost/api/exams'))).status,200);
});
test('exam route accepts valid member actions and rejects unbounded or invalid answers',async()=>{
  const paid=await api('user','paid');
  assert.equal((await paid.POST(post({action:'create'}))).status,200);
  for(const answer of [Array(100).fill(1),[NaN],[-1],[26],['1']])assert.equal((await paid.POST(post({action:'answer',id:randomUUID(),questionId:randomUUID(),answer}))).status,400);
  assert.equal((await paid.GET(new Request('http://localhost/api/exams?report=invalid'))).status,400);
});
