import {test,expect} from '@playwright/test';
import {build} from 'esbuild';
import {generateQuestion,publicQuestion} from '../../src/lib/practice';
for(const level of ['easy','medium','hard'] as const)test(`pipeline ${level}: select one of three while fixed stages remain unchanged`,async({page})=>{
 const question=publicQuestion(generateQuestion('pipeline',level));
 if(question.kind!=='pipeline')throw Error();
 const bundle=await build({stdin:{contents:`import React,{useState}from'react';import{createRoot}from'react-dom/client';import Board from'./src/components/practice/PipelineQuestionBoard';function App(){const [values,setValues]=useState([]);return <><Board question={${JSON.stringify(question)}} values={values} onChange={setValues} disabled={false} zh={false}/><output>{values.join('')}</output></>};createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,outfile:"/tmp/pipeline-fixture.js",format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'i18n',setup(b){b.onResolve({filter:/^@\/lib\/i18n$/},args=>({path:args.path,namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:"export function useI18n(){return {t:(key)=>key}};export function shapeNameKey(){return 'shape'}",loader:'js'}));}}]});
 await page.route('http://pipeline.test/',r=>r.fulfill({contentType:'text/html',body:'<div id="root"></div>'}));await page.goto('http://pipeline.test/');
 for(const file of bundle.outputFiles)if(file.path.endsWith('.css'))await page.addStyleTag({content:file.text});else await page.addScriptTag({content:file.text});
 await expect(page.locator('[data-pipeline-stage]')).toHaveCount(question.boxes.length);
 await expect(page.getByRole('radio')).toHaveCount(3);
 await expect(page.getByRole('textbox')).toHaveCount(0);
 await page.getByRole('radio').nth(1).check();await expect(page.locator('output')).toHaveText(question.options[1].join(''));
 await page.getByRole('radio').nth(2).check();await expect(page.getByRole('radio').nth(1)).not.toBeChecked();
 for(const box of question.boxes.filter(Boolean))await expect(page.getByText(box!.join(''),{exact:true})).toBeVisible();
});
