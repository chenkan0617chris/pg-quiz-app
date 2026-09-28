import { expect, test } from '@playwright/test';

for (const kind of ['numerical', 'figure', 'data']) {
  test(`${kind} guide opens the matching practice type`, async ({ page }) => {
    await page.goto(`/en/guides/${kind}`);
    await page.locator(`a[href="/en/practice?kind=${kind}"]`).first().click();
    await expect(page.locator('#practice-kind')).toHaveValue(kind);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://quiz.ckautoflow.com/en/practice');
  });
}
