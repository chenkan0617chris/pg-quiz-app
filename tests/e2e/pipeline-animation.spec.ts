import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';

// Two boxes: 2314 (known) then 4321 (the solved/unknown one). Input circle, triangle, square, plus.
const PROPS = `input={[1,2,3,4]} stages={[{box:[2,3,1,4]},{box:[4,3,2,1],unknown:true}]}`;

export async function mountAnimation(page: Page, extraCss = '') {
  const bundle = await build({
    stdin: {
      contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import { I18nProvider } from './src/lib/i18n'; import PipelineAnimation from './src/components/pipeline/PipelineAnimation';
        createRoot(document.getElementById('root')).render(<I18nProvider lang="en"><div style={{width:384,padding:16}}><PipelineAnimation ${PROPS} /></div></I18nProvider>);`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, outdir: '/tmp/pg-pipeline-animation', format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    plugins: [{ name: 'fixtures', setup(buildContext) {
      buildContext.onResolve({ filter: /^next\/navigation$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      buildContext.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `export function usePathname(){return '/en/pipeline'} export function useRouter(){return {push(){},replace(){},refresh(){}}}`, loader: 'js' }));
    }}],
  });
  await page.route('http://animation.test/', route => route.fulfill({ contentType: 'text/html', body: '<meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div>' }));
  await page.goto('http://animation.test/');
  if (extraCss) await page.addStyleTag({ content: extraCss });
  for (const file of bundle.outputFiles) await page.addScriptTag({ content: file.text });
}

// Column (0-3) and row of a shape tile, read back from its inline position.
async function tilePosition(page: Page, title: string) {
  return page.locator(`.pa-move[title="${title}"]`).evaluate(el => ({ left: (el as HTMLElement).style.left, top: parseFloat((el as HTMLElement).style.top) }));
}

test('Next walks each shape from its old position to its new one, box by box', async ({ page }) => {
  await mountAnimation(page);
  const caption = page.locator('p[aria-live="polite"]');
  const next = page.getByRole('button', { name: 'Next' });
  await expect(caption).toContainText('Start');
  const startTriangle = await tilePosition(page, 'Yellow triangle');

  await next.click();
  await expect(caption).toContainText('Box 1 · 2314');
  // The unknown second box stays hidden until the shapes reach it.
  await expect(page.getByText('?', { exact: true })).toHaveCount(4);

  // 2314: new position 1 takes the shape from old position 2 (the triangle).
  await next.click();
  await expect(caption).toHaveText('New position 1 ← old position 2: Yellow triangle');
  const movedTriangle = await tilePosition(page, 'Yellow triangle');
  expect(movedTriangle.top).toBeGreaterThan(startTriangle.top);
  expect(movedTriangle.left).toContain('12.5%');

  for (let i = 0; i < 3; i++) await next.click();
  await next.click();
  await expect(caption).toContainText('Box 2 is the unknown box: its answer is 4321');
  await expect(page.getByText('?', { exact: true })).toHaveCount(0);

  for (let i = 0; i < 4; i++) await next.click();
  await next.click();
  await expect(caption).toContainText('Done');
  await expect(next).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Replay' })).toBeVisible();
});

test('Play runs to the end by itself and the progress pills jump between boxes', async ({ page }) => {
  await mountAnimation(page);
  const caption = page.locator('p[aria-live="polite"]');
  await page.getByRole('button', { name: 'Box 2', exact: true }).click();
  await expect(caption).toContainText('Box 2 is the unknown box');
  await page.getByRole('button', { name: 'Input', exact: true }).click();
  await expect(caption).toContainText('Start');
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(caption).toContainText('Done', { timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Replay' })).toBeVisible();
});
