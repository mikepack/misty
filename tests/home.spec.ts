import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/hill chart/i);
});

test('homepage displays content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
