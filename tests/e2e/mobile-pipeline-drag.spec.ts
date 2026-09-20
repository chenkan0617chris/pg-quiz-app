import { expect, test } from '@playwright/test';

test('touch and keyboard controls swap pipeline shapes', async ({ page }) => {
  await page.goto('/en/pipeline', { waitUntil: 'domcontentloaded' });

  const board = page.getByRole('group', { name: 'Pipeline diagram' });
  await expect(board).toBeVisible();
  await expect(board.getByText('Input order (top)')).toBeVisible();
  await expect(board.getByText('Pipeline boxes')).toBeVisible();
  await expect(board.getByText('Output order (bottom)')).toBeVisible();
  await expect(board.locator('[data-pipeline-stage]')).toHaveCount(1);

  const inputLane = board.locator('[data-pipeline-lane="input"]');
  const shapes = inputLane.getByRole('img');

  await expect(shapes).toHaveCount(4);

  const source = shapes.nth(0).locator('..');
  const target = shapes.nth(2).locator('..');
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error('Expected both drag shapes to be visible');

  const pointer = (box: { x: number; y: number; width: number; height: number }) => ({
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    clientX: box.x + box.width / 2,
    clientY: box.y + box.height / 2,
  });

  await source.dispatchEvent('pointerdown', { ...pointer(sourceBox), buttons: 1 });
  await target.dispatchEvent('pointermove', { ...pointer(targetBox), buttons: 1 });
  await target.dispatchEvent('pointerup', { ...pointer(targetBox), buttons: 0 });

  await expect(inputLane.getByRole('img').nth(0)).toHaveAccessibleName('Red square');
  await expect(inputLane.getByRole('img').nth(1)).toHaveAccessibleName('Yellow triangle');
  await expect(inputLane.getByRole('img').nth(2)).toHaveAccessibleName('Green circle');
  await expect(inputLane.getByRole('img').nth(3)).toHaveAccessibleName('Blue plus');

  const firstShape = inputLane.getByRole('button', { name: 'Red square, Position 1' });
  await firstShape.click();
  await firstShape.focus();
  await firstShape.press('ArrowRight');

  await expect(inputLane.getByRole('img').nth(0)).toHaveAccessibleName('Yellow triangle');
  await expect(inputLane.getByRole('img').nth(1)).toHaveAccessibleName('Red square');
});
