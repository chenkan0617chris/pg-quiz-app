import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Mounts one tool with the real request hook, account hook, checkout hook and upgrade card.
// Only Clerk, next/navigation and the HTTP endpoints are replaced.
type Remaining = { solver?: number; practice?: number; memory?: number; status?: 'expired' | 'paid' };
async function mount(page: Page, jsx: string, lang: 'en' | 'zh', initial: Remaining, imports = '') {
  const state = { solver: 10, practice: 10, memory: 10, status: 'expired', ...initial };
  const events: string[] = [];
  await page.route('http://quota.test/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/account') return route.fulfill({ json: {
      status: state.status, memoryRemaining: state.memory, practiceUsage: { pipeline: { started: 1, completed: 1 } }, trialEndsAt: '2026-11-01T00:00:00Z', paidUntil: null, solves: 1,
      solverRemaining: { pipeline: state.solver, numerical: state.solver, figure: state.solver },
      practiceRemaining: { pipeline: state.practice, numerical: state.practice, data: state.practice, figure: state.practice, grid: state.practice },
      progress: { completed: 0, correct: 0, firstCompleted: 0, firstCorrect: 0, recentCompleted: 0, recentCorrect: 0, mockExams: 0 },
    } });
    if (url.pathname === '/api/conversion') { events.push(route.request().postDataJSON().event); return route.fulfill({ status: 204 }); }
    if (url.pathname.startsWith('/api/')) return route.fallback();
    return route.fulfill({ contentType: 'text/html', body: '<meta name="viewport" content="width=device-width,initial-scale=1"><main style="max-width:1024px;margin:auto;padding:16px"><div id="root"></div></main>' });
  });
  const bundle = await build({
    stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import { I18nProvider } from './src/lib/i18n'; ${imports}
      createRoot(document.getElementById('root')).render(<I18nProvider lang="${lang}">${jsx}</I18nProvider>);`, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, outdir: '/tmp/pg-allowance', format: 'iife', jsx: 'automatic', loader: { '.module.css': 'local-css' },
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    plugins: [{ name: 'fixtures', setup(b) {
      b.onResolve({ filter: /^(next\/navigation|next\/link|@clerk\/nextjs)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => {
        if (args.path === 'next/navigation') return { contents: `export function usePathname(){return '/${lang}/numerical'} export function useRouter(){return {push(){},replace(){},refresh(){}}}`, loader: 'js' };
        if (args.path === '@clerk/nextjs') return { contents: `const auth={isLoaded:true,isSignedIn:true,userId:'user_1'};export function useAuth(){return auth} export function useClerk(){return {openSignIn:async()=>{}}}`, loader: 'js' };
        return { contents: `export default function Link({href,children,...props}){return <a href={href}{...props}>{children}</a>}`, loader: 'tsx', resolveDir: process.cwd() };
      });
    } }],
  });
  await page.goto('http://quota.test/');
  const cssDir = '.next/static/chunks';
  await page.addStyleTag({ content: readdirSync(cssDir).filter(f => f.endsWith('.css')).map(f => readFileSync(join(cssDir, f), 'utf8')).join('\n') });
  for (const file of bundle.outputFiles) {
    if (file.path.endsWith('.css')) await page.addStyleTag({ content: file.text });
    else await page.addScriptTag({ content: file.text });
  }
  return { state, events };
}

const numerical = (page: Page, lang: 'en' | 'zh', remaining: Remaining) =>
  mount(page, '<Solver/>', lang, remaining, `import Solver from './src/app/[lang]/numerical/solver';`);
const solved = { ok: true, blanks: 3, solutions: [[1, 2, 3]], truncated: false };
const upgradeCard = (page: Page) => page.getByRole('region', { name: /7-day pass|7 天会员/ });

test('solver shows the remaining count and warns at three left', async ({ page }) => {
  await numerical(page, 'en', { solver: 8 });
  await expect(page.getByText('8 of 10 free solves left')).toBeVisible();
  await expect(upgradeCard(page)).toHaveCount(0);
});

test('solver with three left links to the pass but keeps working', async ({ page }) => {
  await numerical(page, 'zh', { solver: 3 });
  await expect(page.getByText('还剩 3 次免费求解')).toBeVisible();
  await expect(page.getByRole('link', { name: /7 天不限次/ })).toHaveAttribute('href', '/billing');
  await expect(page.getByRole('button', { name: '求解', exact: true })).toBeEnabled();
});

for (const [name, path] of [['numerical', '[lang]/numerical'], ['pipeline', '[lang]/pipeline'], ['figure', '[lang]/series']])
  test(`${name} solver with none left offers the pass in place`, async ({ page }) => {
    const { events } = await mount(page, '<Solver/>', 'en', { solver: 0 }, `import Solver from './src/app/${path}/solver';`);
    await expect(upgradeCard(page)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Solve', exact: true })).toBeDisabled();
    await expect.poll(() => events).toEqual(['upgrade_prompt_viewed']);
  });

test('using the last solve keeps the result and shows the card next to it', async ({ page }) => {
  const { state } = await numerical(page, 'en', { solver: 1 });
  await page.route('http://quota.test/api/solve/numerical', route => { state.solver = 0; return route.fulfill({ json: solved }); });
  await page.getByRole('button', { name: 'Solve', exact: true }).click();
  await expect(upgradeCard(page)).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a server refusal shows the card instead of a red error', async ({ page }) => {
  const { state } = await numerical(page, 'en', { solver: 2 });
  await page.route('http://quota.test/api/solve/numerical', route => { state.solver = 0; return route.fulfill({ status: 403, json: {} }); });
  await page.getByRole('button', { name: 'Solve', exact: true }).click();
  await expect(upgradeCard(page)).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('other failures still show an error and no card', async ({ page }) => {
  await numerical(page, 'en', { solver: 5 });
  await page.route('http://quota.test/api/solve/numerical', route => route.fulfill({ status: 503, json: {} }));
  await page.getByRole('button', { name: 'Solve', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(upgradeCard(page)).toHaveCount(0);
});

test('members see neither a count nor a card', async ({ page }) => {
  await numerical(page, 'en', { solver: 0, status: 'paid' });
  await expect(page.getByRole('button', { name: 'Solve', exact: true })).toBeEnabled();
  await page.waitForTimeout(300);
  await expect(upgradeCard(page)).toHaveCount(0);
  await expect(page.getByText(/free solves left/)).toHaveCount(0);
});

test('the buy button opens Stripe checkout directly', async ({ page }) => {
  await numerical(page, 'zh', { solver: 0 });
  const bodies: unknown[] = [];
  await page.route('http://quota.test/api/checkout', route => { bodies.push(route.request().postDataJSON()); return route.fulfill({ json: { url: 'https://checkout.stripe.com/c/test' } }); });
  await page.route('https://checkout.stripe.com/**', route => route.fulfill({ contentType: 'text/html', body: 'stripe' }));
  await upgradeCard(page).getByRole('button', { name: /US\$6\.99/ }).click();
  await page.waitForURL('https://checkout.stripe.com/c/test');
  expect(bodies).toEqual([{ lang: 'zh' }]);
});

test('the buy button refuses a non-Stripe address and reports the failure', async ({ page }) => {
  await numerical(page, 'en', { solver: 0 });
  await page.route('http://quota.test/api/checkout', route => route.fulfill({ json: { url: 'https://evil.example/pay' } }));
  await upgradeCard(page).getByRole('button', { name: /US\$6\.99/ }).click();
  await expect(upgradeCard(page).getByRole('alert')).toBeVisible();
  expect(page.url()).toBe('http://quota.test/');
});

test('practice with none left replaces the start prompt with the card', async ({ page }) => {
  await page.route('http://quota.test/api/practice*', route => route.fulfill({ json: [] }));
  await mount(page, '<PracticePage/>', 'en', { practice: 0 }, `import PracticePage from './src/components/practice/PracticePage';`);
  await page.route('http://quota.test/api/practice*', route => route.fulfill({ json: [] }));
  await expect(upgradeCard(page)).toBeVisible();
  await expect(upgradeCard(page)).toContainText('retried from Recent practice');
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
});

test('the tenth question can be finished before the card appears', async ({ page }) => {
  const question = { kind: 'figure', version: 1, difficulty: 'easy', frames: [1, 2, 4, 8, 16], options: [8, 16, 32, 64] };
  const explanation = { kind: 'figure', choice: 1, rule: 'cw', frames: [1, 2, 4, 8, 16, 32] };
  const { state } = await mount(page, '<PracticePage initialKind="figure"/>', 'en', { practice: 1 }, `import PracticePage from './src/components/practice/PracticePage';`);
  await page.route('http://quota.test/api/practice*', route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: [] });
    const body = route.request().postDataJSON();
    if (body.action === 'start') { state.practice = 0; return route.fulfill({ json: { id: 'q10', question } }); }
    return route.fulfill({ json: { id: 'q10', question, answer: body.answer, correct: true, referenceAnswer: body.answer, submittedAt: '2026-11-24T00:00:00Z', explanation } });
  });
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByText('Choose the next figure')).toBeVisible();
  await expect(page.getByText('Free questions used')).toBeVisible();
  await expect(upgradeCard(page)).toHaveCount(0);
  await page.getByRole('radio', { name: 'Option A' }).check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct', { exact: true })).toBeVisible();
  await expect(upgradeCard(page)).toBeVisible();
});

test('a member-only retry is explained without claiming the allowance is gone', async ({ page }) => {
  const row = { id: 'old', question: { kind: 'numerical', target: 10 }, answer: [1, 2, 3], correct: false, referenceAnswer: [1, 2, 3], submittedAt: '2026-11-18T00:00:00Z', explanation: {} };
  await page.route('http://quota.test/api/practice*', route => route.request().method() === 'GET' ? route.fulfill({ json: [row] }) : route.fulfill({ status: 403, json: {} }));
  await mount(page, '<PracticePage/>', 'en', { practice: 6 }, `import PracticePage from './src/components/practice/PracticePage';`);
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(upgradeCard(page)).toContainText('needs membership');
  await expect(upgradeCard(page)).not.toContainText('used');
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeEnabled();
});

for (const [name, jsx, imports, remaining] of [
  ['memory', '<T/>', `import T from './src/components/practice/MemoryTraining';`, { memory: 0 }],
  ['grid', '<T/>', `import T from './src/components/exam/GridTraining';`, { practice: 0 }],
] as const) test(`${name} training with no rounds left shows the card`, async ({ page }) => {
  await page.route('http://quota.test/api/practice*', route => route.fulfill({ json: [] }));
  await mount(page, jsx, 'en', remaining, imports);
  await expect(upgradeCard(page)).toBeVisible();
});

test('the page banner steps aside while the in-place card is showing', async ({ page }) => {
  const { events } = await mount(page, '<><GrowthPrompts/><Solver/></>', 'en', { solver: 0 }, `import GrowthPrompts from './src/components/GrowthPrompts'; import Solver from './src/app/[lang]/numerical/solver';`);
  await expect(upgradeCard(page)).toBeVisible();
  await expect(page.getByRole('link', { name: 'See what the pass includes' })).toHaveCount(0);
  await page.waitForTimeout(1200);
  await expect(page.getByRole('link', { name: 'See what the pass includes' })).toHaveCount(0);
  expect(events).toEqual(['upgrade_prompt_viewed']);
});

test('the page banner still appears where no tool shows a card', async ({ page }) => {
  await mount(page, '<GrowthPrompts/>', 'en', { solver: 0 }, `import GrowthPrompts from './src/components/GrowthPrompts';`);
  await expect(page.getByRole('link', { name: 'See what the pass includes' })).toBeVisible();
});

for (const width of [375, 1280]) test(`card fits a ${width}px screen`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await numerical(page, 'zh', { solver: 0 });
  await expect(upgradeCard(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await upgradeCard(page).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `test-results/allowance-card-${width}.png` });
});
