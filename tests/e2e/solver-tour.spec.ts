import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';

// Renders the Switch Challenge solver on its own, with a tall spacer above it like
// the real page's intro copy, so the tour has to scroll to each control.
async function mountSolver(page: Page) {
  const bundle = await build({
    stdin: {
      contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import { I18nProvider } from './src/lib/i18n'; import Solver from './src/app/[lang]/pipeline/solver';
        createRoot(document.getElementById('root')).render(<I18nProvider lang="en"><Solver /></I18nProvider>);`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, outdir: '/tmp/pg-solver-tour', format: 'iife', jsx: 'automatic',
    loader: { '.module.css': 'local-css' },
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    plugins: [{ name: 'fixtures', setup(buildContext) {
      buildContext.onResolve({ filter: /^(next\/navigation|.*\/solve-request)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      buildContext.onLoad({ filter: /.*/, namespace: 'fixture' }, args => {
        if (args.path === 'next/navigation') return { contents: `export function usePathname(){return '/en/pipeline'} export function useRouter(){return {push(){},replace(){},refresh(){}}}`, loader: 'js' };
        return { contents: `export function useSolveRequest(){return {run:async()=>null,busy:false,ready:true,error:null}}`, loader: 'js' };
      });
    }}],
  });
  await page.route('http://solver.test/', route => route.fulfill({ contentType: 'text/html', body: '<meta name="viewport" content="width=device-width,initial-scale=1"><div style="height:600px"></div><div id="root"></div><div style="height:1200px"></div>' }));
  await page.goto('http://solver.test/');
  for (const file of bundle.outputFiles) {
    if (file.path.endsWith('.css')) await page.addStyleTag({ content: file.text });
    else await page.addScriptTag({ content: file.text });
  }
}

const STEP_TITLES = [
  'Drag the shapes to copy your question',
  'The box you need to solve',
  'Known or unknown?',
  'Questions with 2 or 3 boxes',
  'Solve',
];

test('first visit walks through the solver controls, then stays dismissed', async ({ page }) => {
  await mountSolver(page);
  const dialog = page.getByRole('dialog');
  for (const [index, title] of STEP_TITLES.entries()) {
    await expect(dialog.getByRole('heading', { name: title })).toBeVisible();
    await expect(dialog).toContainText(`Step ${index + 1} of ${STEP_TITLES.length}`);
    const last = index === STEP_TITLES.length - 1;
    await dialog.getByRole('button', { name: last ? 'Got it' : 'Next' }).click();
  }
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('ckquiz.switchSolverTour.v1'))).toBe('done');

  await page.reload();
  await mountSolver(page);
  await page.waitForTimeout(1000);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'How to use' }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: STEP_TITLES[0] })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
  test(`each step brings its control into view at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await mountSolver(page);
    const targets = ['[data-pipeline-lane="input"]', '[data-pipeline-stage]', '[data-tour="stage-settings"]', '[data-tour="add-box"]', '[data-tour="solve"]'];
    for (const [index, selector] of targets.entries()) {
      await expect(page.getByRole('dialog').getByRole('heading', { name: STEP_TITLES[index] })).toBeVisible();
      await page.waitForTimeout(900);
      const { target, card } = await page.evaluate(sel => {
        const t = document.querySelector(sel)!.getBoundingClientRect();
        const c = document.querySelector('[role="dialog"]')!.getBoundingClientRect();
        return { target: { top: t.top, bottom: t.bottom }, card: { top: c.top, bottom: c.bottom } };
      }, selector);
      expect(target.top, `${STEP_TITLES[index]} target on screen`).toBeGreaterThanOrEqual(0);
      expect(target.bottom).toBeLessThanOrEqual(viewport.height);
      // The explanation card must not sit on top of the control it explains.
      const overlap = Math.min(target.bottom, card.bottom) - Math.max(target.top, card.top);
      if (viewport.width < 768) expect(overlap, `${STEP_TITLES[index]} card overlap`).toBeLessThanOrEqual(0);
      await page.keyboard.press('ArrowRight');
    }
  });
}
