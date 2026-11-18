import { expect, test } from '@playwright/test';

const labels = { numerical: 'Digit Challenge', figure: 'Figure reasoning', data: 'Data interpretation' };

for (const kind of ['numerical', 'figure', 'data'] as const) {
  test(`${kind} guide opens the matching practice type`, async ({ page }) => {
    await page.goto(`/en/guides/${kind}`);
    await page.locator(`a[href="/en/practice?kind=${kind}"]`).first().click();
    await expect(page.getByRole('radio', { name: labels[kind] })).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://quiz.ckautoflow.com/en/practice');
  });
}
