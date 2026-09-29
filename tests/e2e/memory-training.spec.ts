import { expect, test } from '@playwright/test';
import { build } from 'esbuild';

for(const exhausted of [false,true])test(`standalone memory ${exhausted?'keeps the free limit':'automatically saves completed recall'}`,async({page})=>{
  const commands:Record<string,unknown>[]=[];
  const question={kind:'memory',version:1,difficulty:'easy',sequence:[2,7,4]};
  const round={id:'memory-round',question};
  const result={...round,answer:[2,7,4],correct:true,referenceAnswer:[2,7,4],submittedAt:'2026-09-29T10:00:00Z'};
  let saved=false;
  await page.route('http://memory.test/',r=>r.fulfill({contentType:'text/html',body:'<div id="root"></div>'}));
  await page.route('**/api/practice*',route=>{
    if(route.request().method()==='GET')return route.fulfill({json:saved?[result]:[]});
    const command=route.request().postDataJSON();commands.push(command);
    if(command.action==='submit')saved=true;
    return route.fulfill({json:command.action==='start'?round:result});
  });
  const bundle=await build({stdin:{contents:`import React from'react';import{createRoot}from'react-dom/client';import MemoryTraining from './src/components/practice/MemoryTraining';createRoot(document.getElementById('root')).render(<MemoryTraining/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','process.env':'{}'},plugins:[{name:'contexts',setup(b){
    b.onResolve({filter:/^(.*\/i18n|.*\/use-account|@clerk\/nextjs)$/},args=>({path:args.path,namespace:'fixture'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path.endsWith('/i18n')?`export function useI18n(){return {lang:'en'}}`:args.path.endsWith('/use-account')?`export function useAccount(){return {userId:'test-user',isLoaded:true,failed:false,account:{status:'${exhausted?'expired':'paid'}',memoryRemaining:${exhausted?0:10}}}}`:`export function useAuth(){return {isLoaded:true,isSignedIn:true}};export function useClerk(){return {openSignIn:async()=>{}}}`,loader:'js'}));
  }}]});
  await page.goto('http://memory.test/');await page.addScriptTag({content:bundle.outputFiles[0].text});
  await expect(page.getByRole('combobox')).toHaveCount(0);
  if(exhausted){
    await expect(page.getByRole('link',{name:'Free rounds used · unlock membership'})).toHaveAttribute('href','/billing');
    await expect(page.getByRole('button',{name:'Start memory training'})).toHaveCount(0);
    expect(commands).toEqual([]);return;
  }
  await page.getByRole('button',{name:'Start memory training',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Watch and remember'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Position 2',exact:true})).toBeEnabled({timeout:7000});
  for(const position of [2,7,4])await page.getByRole('button',{name:`Position ${position}`,exact:true}).click();
  await expect(page.getByRole('heading',{name:'Sequence complete — well done'})).toBeVisible();
  expect(commands).toEqual([{action:'start',kind:'memory',difficulty:'easy',sampleIndex:0},{action:'submit',id:'memory-round',answer:[2,7,4]}]);
  await expect(page.getByRole('button',{name:'Start next round'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Review round',exact:true})).toBeVisible();
});
