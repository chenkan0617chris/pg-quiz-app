import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { newExam, transitionExam, examView, examReport } from '../../src/lib/exam';
import { randomUUID } from 'node:crypto';
import type { ExamCommand } from '../../src/lib/exam-types';

test.use({ viewport:{width:1280,height:900},isMobile:false,hasTouch:false });
async function mount(page:Page,component:string,member=false,zh=false){
  const account={status:member?'paid':'expired'};
  const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Component from'./src/components/exam/${component}';createRoot(document.getElementById('root')).render(<Component/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','process.env':'{}'},plugins:[{name:'test-context',setup(b){
    b.onResolve({filter:/^@\/lib\/(i18n|use-account)$/},args=>({path:args.path,namespace:'test'}));
    b.onLoad({filter:/.*/,namespace:'test'},args=>({contents:args.path.endsWith('i18n')?`export function useI18n(){return {lang:'${zh?'zh':'en'}',t:(key)=>key}};export function shapeNameKey(){return 'shape'}`:`export function useAccount(){return {userId:${member?"'test-user'":"null"},account:${JSON.stringify(member?account:null)},isLoaded:true,failed:false}}`,loader:'js'}));
    b.onResolve({filter:/\.module\.css$/},args=>({path:args.path,namespace:'css-stub'}));
    b.onLoad({filter:/.*/,namespace:'css-stub'},()=>({contents:'export default {}',loader:'js'}));
  }}]});
  const dir='.next/static/chunks';
  const css=readdirSync(dir).filter(f=>f.endsWith('.css')).map(f=>readFileSync(join(dir,f),'utf8')).join('\n');
  await page.route('http://exam.test/',route=>route.fulfill({contentType:'text/html',body:`<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><main style="max-width:1100px;margin:auto;padding:20px"><div id="root"></div></main></body></html>`}));
  await page.goto('http://exam.test/');
  await page.addScriptTag({content:bundle.outputFiles[0].text});
}

test('guests see both previews and membership link on desktop and mobile',async({page})=>{
  await mount(page,'ExamCenter',false,true);
  await expect(page.getByRole('heading',{name:'模拟考中心',exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:/开通会员，解锁完整模拟考/})).toHaveAttribute('href','/billing');
  await page.getByRole('tab',{name:'报告预览'}).click();
  await expect(page.getByText('训练总分',{exact:true})).toBeVisible();
  await expect(page.getByText('示例 · 非真实成绩')).toBeVisible();
  await expect(page.getByRole('button',{name:/准备开始模拟考试/})).toHaveCount(0);
  for(const width of [375,1280]){
    await page.setViewportSize({width,height:950});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/mock-exam-center-${width}.png`,fullPage:true});
  }
});

test('member completes all sections, fullscreen recovery preserves answers and report is saved',async({page})=>{
  // Two server-expiry checks each wait for the real 15-second sync interval.
  test.setTimeout(60_000);
  let state=newExam(randomUUID(),Date.now());
  await page.route('**/api/exams*',async route=>{
    const req=route.request();
    if(req.method()==='GET')return route.fulfill({json:req.url().includes('report=')?examReport(state):[]});
    const body=req.postDataJSON();
    if(body.action!=='create')state=transitionExam(state,body as ExamCommand,Date.now());
    return route.fulfill({json:examView(state,Date.now())});
  });
  await mount(page,'ExamCenter',true);
  await page.getByRole('button',{name:'Prepare for your mock exam →'}).click();
  await page.getByRole('button',{name:'Enter fullscreen & start'}).click();
  await expect(page.getByRole('radio')).toHaveCount(3);
  const q=state.current!.question;
  if(q.kind!=='pipeline')throw new Error('Expected pipeline');
  await page.getByRole('radio',{name:new RegExp(q.answer.join('')+'$')}).check();
  await page.getByRole('button',{name:'Finish exam',exact:true}).click();
  await page.getByRole('button',{name:'Return to exam',exact:true}).click();
  await expect(page.getByRole('radio',{name:new RegExp(q.answer.join('')+'$')})).toBeChecked();
  await page.evaluate(()=>document.exitFullscreen());
  await expect(page.getByRole('heading',{name:'Return to fullscreen'})).toBeVisible();
  await page.getByRole('button',{name:'Resume fullscreen'}).click();
  await expect(page.getByRole('radio',{name:new RegExp(q.answer.join('')+'$')})).toBeChecked();
  await page.getByRole('button',{name:'Submit & continue →'}).click();
  await expect.poll(()=>state.attempts.length).toBe(1);
  // Server expiration is authoritative; force it in this isolated API fixture.
  state.deadline=Date.now()-1;
  await expect(page.getByRole('button',{name:'Enter fullscreen & start'})).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Enter fullscreen & start'}).click();
  await expect(page.getByText('Use three distinct digits from 1–9. Multiply before adding.')).toBeVisible();
  state.deadline=Date.now()-1;
  await expect(page.getByRole('button',{name:'Enter fullscreen & start'})).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Enter fullscreen & start'}).click();
  await page.getByRole('button',{name:'Begin observation'}).click();
  await expect(page.getByRole('button',{name:'Symmetric',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Finish exam',exact:true}).click();
  await page.getByRole('button',{name:'Finish & view report',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Question review'})).toBeVisible();
  await expect(page.getByText('1 / 0 / 1',{exact:true})).toBeVisible();
  await expect(page.getByText('0 / 0 / 1',{exact:true})).toHaveCount(2);
  expect(state.phase).toBe('completed');
  await page.screenshot({path:'test-results/mock-exam-report.png',fullPage:true});
});

test('Grid fixed sample interleaves judgements and scores recall separately',async({page})=>{
  await mount(page,'GridTraining');
  await page.getByRole('button',{name:'Begin observation'}).click();
  for(const label of ['Symmetric','Not symmetric','Symmetric'])await page.getByRole('button',{name:label,exact:true}).click();
  for(const position of [7,19,11])await page.getByRole('button',{name:`Position ${position}`,exact:true}).click();
  await expect(page.getByRole('heading',{name:'Round score · 6/6'})).toBeVisible();
});

test('PEAK requires responses then gives reflections, not hiring scores',async({page})=>{
  await mount(page,'PeakTraining');
  await expect(page.getByRole('button',{name:'Complete & reflect (0/5)'})).toBeDisabled();
  for(const group of await page.locator('fieldset').all())await group.getByRole('radio').nth(3).check();
  await page.getByRole('button',{name:'Complete & reflect (5/5)'}).click();
  await expect(page.getByRole('heading',{name:'Familiarization complete · 5 / 5'})).toBeVisible();
  await expect(page.getByText(/This is not a personality score/)).toBeVisible();
});

test('Grid observation expires during a request and remount preserves recall progress',async({page})=>{
  const bundle=await build({stdin:{contents:`import React,{useState}from'react';import{createRoot}from'react-dom/client';import GridBoard from './src/components/exam/GridBoard';
  const q={kind:'grid',sequence:[7,19,11],spatial:Array.from({length:3},()=>({cells:Array(16).fill(1)}))};
  function App(){const [key,setKey]=useState(0);const [disabled,setDisabled]=useState(false);const [answer,setAnswer]=useState(null);return <><button onClick={()=>setKey(key+1)}>Remount question</button><button onClick={()=>setDisabled(!disabled)}>Toggle pending request</button><GridBoard key={key} storageKey="regression-grid" question={q} zh={false} disabled={disabled} onAnswer={setAnswer}/><output>{JSON.stringify(answer)}</output></>};createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
  await page.route('http://exam.test/',r=>r.fulfill({contentType:'text/html',body:'<div id="root"></div>'}));
  await page.goto('http://exam.test/');await page.addScriptTag({content:bundle.outputFiles[0].text});
  await page.getByRole('button',{name:'Begin observation'}).click();
  await page.getByRole('button',{name:'Toggle pending request'}).click();
  await expect(page.getByRole('button',{name:'Symmetric',exact:true})).toBeVisible({timeout:2000});
  await page.getByRole('button',{name:'Toggle pending request'}).click();
  for(let i=0;i<3;i++)await page.getByRole('button',{name:'Symmetric',exact:true}).click();
  await page.getByRole('button',{name:'Position 7',exact:true}).click();
  await page.getByRole('button',{name:'Remount question'}).click();
  await expect(page.getByRole('button',{name:'Begin observation'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Position 7',exact:true})).toHaveText('1');
  await page.getByRole('button',{name:'Position 19',exact:true}).click();
  await page.getByRole('button',{name:'Position 11',exact:true}).click();
  await expect(page.locator('output')).toHaveText('[7,19,11,1,1,1]');
});
