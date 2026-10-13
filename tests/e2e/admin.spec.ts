import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readFileSync, readdirSync } from 'node:fs';

const usage={userId:'user_fixture',status:'paid',lifetime:true,paidUntil:null,trialEndsAt:null,lastActivity:'2026-10-13T03:12:00Z',solves:12,practiceStarted:18,practiceCompleted:14,exams:2,training:3,quotas:[{kind:'pipeline',used:3,limit:10},{kind:'numerical',used:0,limit:10},{kind:'figure',used:7,limit:10},{kind:'memory',used:10,limit:10}]};
const user={id:'user_fixture',name:'测试用户',email:'fixture@example.test',createdAt:'2026-10-01T00:00:00Z',usage};
const detail={user,usage,history:{hasNext:true,items:[
  {eventId:'a',tool:'solver:pipeline',action:'solved',occurredAt:'2026-10-13T03:12:00Z',freeCredits:0,source:'server',correct:null},
  {eventId:'b',tool:'practice:memory',action:'completed',occurredAt:'2026-10-13T02:00:00Z',freeCredits:0,source:'server',correct:false},
  {eventId:'c',tool:'practice:memory',action:'started',occurredAt:'2026-10-13T01:00:00Z',freeCredits:null,source:'server',correct:null},
  {eventId:'d',tool:'training:peak',action:'completed',occurredAt:'2026-10-12T01:00:00Z',freeCredits:0,source:'client',correct:null},
]}};
async function render(page:Page,detailPage:boolean,allowed:boolean,query:Record<string,string>={}) {
  const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Page from './src/app/admin/${detailPage?'users/[userId]/':''}page';(async()=>{const view=await Page({params:Promise.resolve({userId:'user_fixture'}),searchParams:Promise.resolve(${JSON.stringify(query)})});createRoot(document.getElementById('root')).render(view)})().catch(error=>{document.body.textContent='ERROR:'+error.message});`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{
    name:'admin-fixtures',setup(builder){
      builder.onResolve({filter:/^(@\/lib\/admin\/(auth|data|store)|next\/link|next\/navigation)$/},args=>({path:args.path,namespace:'fixture'}));
      builder.onLoad({filter:/.*/,namespace:'fixture'},args=>{
        if(args.path==='next/link')return {contents:`import React from 'react';export default function Link(props){return React.createElement('a',props)}`,loader:'js',resolveDir:process.cwd()};
        if(args.path==='next/navigation')return {contents:`export function notFound(){throw new Error('not found')}`};
        if(args.path.endsWith('/auth'))return {contents:`export async function adminIdentity(){return {userId:'user_fixture',allowed:${allowed}}}`};
        if(args.path.endsWith('/store'))return {contents:'export const USER_PAGE_SIZE=25;'};
        return {contents:`export async function adminUsers(){${allowed?`return ${JSON.stringify({total:26,users:[user]})}`:"throw new Error('Unauthorized data read')"}};export async function adminUserDetail(){${allowed?`return ${JSON.stringify(detail)}`:"throw new Error('Unauthorized data read')"}}`};
      });
    },
  }]});
  await page.setContent('<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main style="max-width:1024px;margin:auto;padding:24px"><div id="root"></div></main></body></html>');
  const cssFiles=readdirSync('.next/static',{recursive:true}).filter(file=>String(file).endsWith('.css'));
  for(const css of cssFiles)await page.addStyleTag({content:readFileSync(`.next/static/${css}`,'utf8')});
  await page.addScriptTag({content:bundle.outputFiles[0].text});
}

test('non-admin pages never query or render private user data',async({page})=>{
  for(const detailPage of [false,true]){
    await render(page,detailPage,false);
    await expect(page.getByRole('heading',{name:'仅管理员可访问'})).toBeVisible();
    await expect(page.getByText('fixture@example.test')).toHaveCount(0);
    await expect(page.getByText(/Unauthorized data read/)).toHaveCount(0);
  }
});
test('admin list shows real component layout, search and bounded navigation',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await render(page,false,true);
  await expect(page.getByRole('heading',{name:'用户使用后台'})).toBeVisible();
  await expect(page.getByText('fixture@example.test')).toBeVisible();
  await expect(page.getByRole('cell',{name:/20 \/ 40/})).toBeVisible();
  await expect(page.getByRole('link',{name:'下一页'})).toHaveAttribute('href','/admin?q=&page=2');
  await page.screenshot({path:'/tmp/pg-admin-list.png',fullPage:true});
});
test('admin detail distinguishes unknown history, lifetime membership and client events on mobile',async({page})=>{
  await render(page,true,true,{tool:'practice:memory',from:'2026-10-01'});
  await expect(page.getByRole('heading',{name:'测试用户'})).toBeVisible();
  await expect(page.getByText(/会员到期：永久会员/)).toBeVisible();
  await expect(page.getByRole('cell',{name:'未知',exact:true})).toBeVisible();
  await expect(page.getByRole('cell',{name:'客户端上报',exact:true})).toHaveCount(1);
  await expect(page.getByRole('combobox',{name:'工具'})).toHaveValue('practice:memory');
  await expect(page.getByRole('link',{name:'下一页'})).toHaveAttribute('href',/tool=practice%3Amemory&from=2026-10-01&to=&page=2/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:'/tmp/pg-admin-detail-mobile.png',fullPage:true});
});
test('invalid date filters render a recoverable error',async({page})=>{
  await render(page,true,true,{from:'2026-02-30'});
  await expect(page.getByRole('alert')).toContainText('日期无效');
  await expect(page.getByRole('link',{name:'清除筛选'})).toBeVisible();
});
test('live routes deny anonymous admin data and reject anonymous activity writes',async({page,request})=>{
  await page.goto('/admin');
  await expect(page.getByRole('heading',{name:'请先登录管理员账号'})).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  const response=await request.post('/api/activity',{data:{tool:'training:grid',action:'started',sessionId:'28a8d33a-19d3-4972-9a02-14f8bc51da09'}});
  expect(response.status()).toBe(401);
  expect(response.headers()['cache-control']).toContain('no-store');
});
