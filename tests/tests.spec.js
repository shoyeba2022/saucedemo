import { test, expect } from '@playwright/test';

test('Login with locked_out_user and verify error message', async ({ page }) => {
  // Navigate to the site
  await page.goto('https://www.saucedemo.com/');

  // Enter username
  await page.locator('#user-name').fill('locked_out_user');

  // Enter password
  await page.locator('#password').fill('secret_sauce');

  // Click login button
  await page.locator('#login-button').click();

  // Locate error message
  const errorMessage = page.locator('[data-test="error"]');

  // Verify error message is visible
  await expect(errorMessage).toBeVisible();

  // Verify exact error text
  await expect(errorMessage).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.'
  );
});