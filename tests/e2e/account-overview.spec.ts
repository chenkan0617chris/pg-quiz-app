import {expect,test} from '@playwright/test';
import {build} from 'esbuild';
for(const paid of [false,true]){
 test(`account overview explains ${paid?'paid':'free'} usage without daily resets`,async({page})=>{
  page.on('pageerror',error=>console.error(error.message));
  const account={status:paid?'paid':'expired',paidUntil:paid?'2026-10-28T00:00:00Z':null,trialEndsAt:'2026-09-01T00:00:00Z',solverRemaining:{pipeline:8,numerical:10,figure:3},memoryRemaining:0,practiceUsage:{memory:{started:12,completed:9}}};
  const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import AccountOverview from'./src/components/AccountOverview';createRoot(document.getElementById('root')).render(<AccountOverview zh={false} account={${JSON.stringify(account)}}/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','process.env':'{}'}});
  await page.setContent('<div id="root"></div>');await page.addScriptTag({content:bundle.outputFiles[0].text});
  await expect(page.getByRole('heading',{name:paid?'Member Plan':'Free Plan',exact:true})).toBeVisible();
  await expect(page.getByRole('columnheader',{name:'Used',exact:true})).toHaveCount(0);
  for(const [name,remaining] of [['Pipeline solver',8],['Numerical solver',10],['Figure solver',3],['Sequence memory',0]] as const){
   const bar=page.getByRole('progressbar',{name,exact:true});
   await expect(bar).toHaveAttribute('aria-valuenow',String(remaining));
   await expect(bar).toHaveAttribute('aria-valuetext',`${remaining} of 10 credits remaining`);
   await expect(bar.locator('div')).toHaveAttribute('style',`width: ${remaining*10}%;`);
   const row=page.getByRole('row').filter({has:bar});
   await expect(row.getByRole('cell')).toContainText(`${remaining} / 10`);
   await expect(row.getByRole('cell')).toContainText(`${remaining*10}%`);
  }
  const activity=page.getByRole('row').filter({has:page.getByRole('rowheader',{name:'Memory',exact:true})});
  await expect(activity.getByRole('cell').first()).toHaveText('12');
  await expect(activity.getByRole('cell').last()).toHaveText('9');
  await expect(page.getByText(paid?'Unlimited during access; free credits stay intact.':'Separate lifetime allowances. No daily reset.')).toBeVisible();
 });
}
