import { expect, test } from '@playwright/test';

const pages = ['', '/pipeline', '/guides/pipeline', '/guides/aon-assessment'];

for (const path of pages) {
  for (const [from, to, tag] of [['en', 'zh', 'zh-CN'], ['zh', 'en', 'en']]) {
    test(`/${from}${path} links to its ${to} version without JavaScript`, async ({ request }) => {
      const html = await (await request.get(`/${from}${path}`)).text();
      const anchors = html.match(/<a\b[^>]*>/g) ?? [];
      expect(anchors.some(a => a.includes(`href="/${to}${path}"`) && new RegExp(`hreflang="${tag}"`, 'i').test(a))).toBe(true);
    });
  }
}

test('switching language keeps the query string and reloads the document language', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/en/practice?kind=figure');
  await page.getByRole('link', { name: 'Switch to 中文' }).click();
  await expect(page).toHaveURL(/\/zh\/practice\?kind=figure$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});

test('pages outside a locale offer no link to a page that does not exist', async ({ request }) => {
  const html = await (await request.get('/billing')).text();
  expect(html).not.toMatch(/href="\/(zh|en)\/billing"/);
});
