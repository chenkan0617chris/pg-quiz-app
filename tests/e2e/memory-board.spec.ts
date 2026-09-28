import { expect, test } from '@playwright/test';
import { build } from 'esbuild';

async function bundle(review = false) {
  const result = await build({
    stdin: {
      contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
        import MemoryBoard from './src/components/practice/MemoryBoard';
        createRoot(document.getElementById('root')).render(<MemoryBoard sequence={[2,7,4]} zh={false} review={${review}} onAnswer={answer => window.answer = answer}/>);`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  return result.outputFiles[0].text;
}

test('memory blocks early clicks, plays positions in order, then collects one answer', async ({ page }) => {
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({ content: await bundle() });
  const position = (n: number) => page.getByRole('button', { name: `Position ${n}`, exact: true });
  await expect(page.getByRole('button', { name: /^Position / })).toHaveCount(25);
  await expect(position(2)).toBeDisabled();
  await page.getByRole('button', { name: 'Play once and remember' }).click();
  await expect(position(2)).toBeDisabled();
  for (const n of [2, 7, 4]) {
    await expect(position(n)).toHaveAttribute('data-active', 'true');
    await expect(position(n)).toHaveAttribute('data-active', 'false');
  }
  await expect(position(2)).toBeEnabled();
  await position(2).click();
  await expect(position(2)).toBeDisabled();
  await expect(position(2)).toHaveText('1');
  await position(7).click();
  await expect(position(7)).toHaveText('2');
  expect(await page.evaluate(() => 'answer' in window)).toBe(false);
  await position(4).click();
  await expect(page.getByRole('status')).toContainText('Sequence entered');
  expect(await page.evaluate(() => (window as Window & { answer?: number[] }).answer)).toEqual([2, 7, 4]);
  await expect(position(1)).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Play once and remember' })).toHaveCount(0);
});

test('review replays the correct sequence without accepting answers', async ({ page }) => {
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({ content: await bundle(true) });
  await expect(page.getByText(/Correct order: 2 → 7 → 4/)).toBeVisible();
  await page.getByRole('button', { name: 'Replay correct sequence' }).click();
  await expect(page.getByRole('button', { name: 'Position 2', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('button', { name: 'Replay correct sequence' })).toBeVisible({ timeout: 6000 });
  await expect(page.getByRole('button', { name: 'Position 2', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => 'answer' in window)).toBe(false);
});
