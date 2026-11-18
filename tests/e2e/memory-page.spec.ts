import { expect, test } from '@playwright/test';

for (const [lang, title] of [['en', 'Sequence memory training'], ['zh', '记忆力训练：圆点顺序记忆']]) {
  test(`${lang} memory is a standalone training page, separate from the bank`, async ({ page }) => {
    await page.goto(`/${lang}/memory`);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.locator('#practice-kind')).toHaveCount(0);
    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('button',{name:lang==='zh'?'开始记忆训练':'Start memory training',exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:lang==='zh'?'位置 1':'Position 1',exact:true})).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.goto(`/${lang}/practice`);
    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('radiogroup', { name: lang === 'zh' ? '选择题型' : 'Choose a question type' }).getByRole('radio')).toHaveCount(4);
    await page.goto(`/${lang}/practice?kind=memory`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/memory$`));
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  });
}
