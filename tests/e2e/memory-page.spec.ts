import { expect, test } from '@playwright/test';

for (const [lang, title, label] of [['en', 'Sequence memory training', 'Sequence memory'], ['zh', '记忆力训练：圆点顺序记忆', '记忆力训练']]) {
  test(`${lang} memory page is reachable from home and preselects memory practice`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await page.locator(`a[href="/${lang}/memory"]`).last().click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.locator('#practice-kind')).toHaveValue('memory');
    await expect(page.getByRole('navigation').getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
