import { expect, test } from '@playwright/test';
import { build } from 'esbuild';

test('practice opens the selected exercise directly without repeating the sidebar picker', async ({ page }) => {
  await page.route('http://practice.test/', route => route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }));
  const bundle = await build({
    stdin: {
      contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import PracticePage from './src/components/practice/PracticePage'; createRoot(document.getElementById('root')).render(<PracticePage initialKind="figure" />);`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, outdir: '/tmp/pg-practice-picker', format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    plugins: [{ name: 'contexts', setup(buildContext) {
      buildContext.onResolve({ filter: /^(.*\/i18n|.*\/use-account|.*\/solve-request|@clerk\/nextjs|next\/link)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      buildContext.onLoad({ filter: /.*/, namespace: 'fixture' }, args => {
        if (args.path.endsWith('/i18n')) return { contents: `export function useI18n(){return {lang:'en'}}; export function shapeNameKey(){return 'shape'}`, loader: 'js' };
        if (args.path.endsWith('/use-account')) return { contents: `export function useAccount(){return {account:null}}`, loader: 'js' };
        if (args.path.endsWith('/solve-request')) return { contents: `export function useSolveRequest(){return {run:async()=>null,busy:false,ready:true,error:null}}`, loader: 'js' };
        if (args.path === '@clerk/nextjs') return { contents: `export function useAuth(){return {userId:null,isSignedIn:false}}`, loader: 'js' };
        return { contents: `export default function Link({href,children,...props}){return <a href={href}{...props}>{children}</a>}`, loader: 'tsx', resolveDir: process.cwd() };
      });
    }}],
  });
  await page.goto('http://practice.test/');
  for (const file of bundle.outputFiles) {
    if (file.path.endsWith('.css')) await page.addStyleTag({ content: file.text });
    else await page.addScriptTag({ content: file.text });
  }

  await expect(page.getByRole('radiogroup', { name: 'Choose a question type' })).toHaveCount(0);
  await expect(page.locator('[data-practice-kind="figure"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Figure reasoning' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
});

test('recent practice shows eight submissions per page with previous and next controls', async ({ page }) => {
  const history = Array.from({ length: 11 }, (_, index) => ({
    id: `result-${index + 1}`,
    question: { kind: 'pipeline' },
    answer: [1],
    correct: index % 2 === 0,
    referenceAnswer: [1],
    submittedAt: new Date(2026, 0, index + 1).toISOString(),
    explanation: {},
  }));
  await page.route('http://practice.test/', route => route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }));
  await page.route('http://practice.test/api/practice?scope=bank', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(history) }));
  const bundle = await build({
    stdin: {
      contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import PracticePage from './src/components/practice/PracticePage'; createRoot(document.getElementById('root')).render(<PracticePage />);`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, outdir: '/tmp/pg-practice-history', format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    plugins: [{ name: 'contexts', setup(buildContext) {
      buildContext.onResolve({ filter: /^(.*\/i18n|.*\/use-account|.*\/solve-request|@clerk\/nextjs|next\/link)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      buildContext.onLoad({ filter: /.*/, namespace: 'fixture' }, args => {
        if (args.path.endsWith('/i18n')) return { contents: `export function useI18n(){return {lang:'en'}}; export function shapeNameKey(){return 'shape'}`, loader: 'js' };
        if (args.path.endsWith('/use-account')) return { contents: `export function useAccount(){return {account:null}}`, loader: 'js' };
        if (args.path.endsWith('/solve-request')) return { contents: `export function useSolveRequest(){return {run:async()=>null,busy:false,ready:true,error:null}}`, loader: 'js' };
        if (args.path === '@clerk/nextjs') return { contents: `export function useAuth(){return {userId:'user-1',isSignedIn:true}}`, loader: 'js' };
        return { contents: `export default function Link({href,children,...props}){return <a href={href}{...props}>{children}</a>}`, loader: 'tsx', resolveDir: process.cwd() };
      });
    }}],
  });
  await page.goto('http://practice.test/');
  for (const file of bundle.outputFiles) {
    if (file.path.endsWith('.css')) await page.addStyleTag({ content: file.text });
    else await page.addScriptTag({ content: file.text });
  }

  const recentPractice = page.getByRole('complementary');
  await expect(recentPractice.getByRole('listitem')).toHaveCount(8);
  await expect(recentPractice.getByRole('button', { name: 'Previous' })).toBeDisabled();
  await recentPractice.getByRole('button', { name: 'Next' }).click();
  await expect(recentPractice.getByRole('listitem')).toHaveCount(3);
  await expect(recentPractice.getByText('2 / 2')).toBeVisible();
  await expect(recentPractice.getByRole('button', { name: 'Next' })).toBeDisabled();
  await recentPractice.getByRole('button', { name: 'Previous' }).click();
  await expect(recentPractice.getByRole('listitem')).toHaveCount(8);
});
