import { expect, test } from '@playwright/test';
import { build } from 'esbuild';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

for (const zh of [false, true]) {
  for (const status of ['expired', 'paid', 'trial', 'guest', 'loading', 'failed'] as const) {
    test(`billing comparison: ${zh ? 'Chinese' : 'English'} ${status}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      const cssDir = '.next/static/chunks';
      const styles = readdirSync(cssDir).filter(file => file.endsWith('.css')).map(file => readFileSync(join(cssDir, file), 'utf8')).join('\n');
      const account = ['expired', 'paid', 'trial'].includes(status) ? { status } : null;
      const props = { zh, enabled: true, busy: false, error: '', account, signedIn: status !== 'guest', loading: status === 'loading', failed: status === 'failed' };
      const bundle = await build({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import PlanComparison from './src/app/billing/plan-comparison';createRoot(document.getElementById('root')).render(<PlanComparison {...${JSON.stringify(props)}} onBuy={()=>{document.getElementById('action').textContent='checkout requested'}}/>);`, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' } });
      await page.setContent(`<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${styles}</style></head><body><main style="max-width:1024px;margin:auto;padding:16px"><div id="root"></div><p id="action"></p></main></body></html>`);
      await page.addScriptTag({ content: bundle.outputFiles[0].text });
      await expect(page.getByRole('table')).toBeVisible();
      const current = page.getByText(zh ? '当前方案' : 'Current plan', { exact: false });
      if (status === 'paid' || status === 'expired') {
        await expect(page.getByRole('article', { name: status === 'paid' ? 'Member Plan' : 'Free Plan', exact: true }).getByText(zh ? '当前方案' : 'Current plan', { exact: false })).toBeVisible();
      } else if (status === 'trial' || status === 'guest') {
        await expect(page.locator('article').getByText(zh ? '当前方案' : 'Current plan', { exact: false })).toHaveCount(0);
      }
      if (status === 'loading') await expect(current).toBeVisible();
      const newQuestions = page.getByRole('row').filter({ has: page.getByRole('rowheader', { name: zh ? '四类练习持续生成新题' : 'Generate new questions in all four types', exact: true }) });
      await expect(newQuestions.getByRole('cell').nth(0)).toHaveText(zh ? '×不包含' : '×Not included');
      await expect(newQuestions.getByRole('cell').nth(1)).toHaveText(zh ? '✓包含' : '✓Included');
      await expect(page.getByText(zh ? '模拟考试与模拟卷' : 'Mock exams & practice papers', { exact: true })).toBeVisible();
      await expect(page.getByText(zh ? '会员可使用三项限时模拟考、全屏考场与逐题成绩报告。非会员可查看功能预览，已有报告在会员到期后保留。' : 'Members get three timed challenges, fullscreen exams and question reports. Free users can preview the experience; existing reports remain available after membership expires.')).toBeVisible();
      const buy = page.getByRole('button', { name: zh ? '购买 30 天会员' : 'Buy 30-day access', exact: true });
      if (status === 'paid') await expect(buy).toHaveCount(0);
      else if (status === 'loading' || status === 'failed') await expect(buy).toBeDisabled();
      else { await buy.click(); await expect(page.locator('#action')).toHaveText('checkout requested'); }
      for (const width of [375, 1280]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (status === 'expired' && zh) await page.screenshot({ path: `test-results/billing-zh-${width}.png`, fullPage: true });
      }
      expect(errors).toEqual([]);
    });
  }
}
