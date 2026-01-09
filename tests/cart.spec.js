import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const PASSWORD = 'secret_sauce';


test('Q3: Performance user Z-A filter and purchase flow', async ({ page }) => {
  await page.goto(BASE_URL);

  // Login
  await page.fill('#user-name', 'performance_glitch_user');
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');

  // Reset App State
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#react-burger-cross-btn');

  // Sort Z to A
  await page.selectOption('.product_sort_container', 'za');

  // Select first product
  const productName = await page.locator('.inventory_item_name').first().textContent();
  const productPrice = await page.locator('.inventory_item_price').first().textContent();
  await page.locator('.inventory_item button').first().click();

  // Go to cart
  await page.click('.shopping_cart_link');

  // Verify cart data
  await expect(page.locator('.inventory_item_name')).toHaveText(productName);
  await expect(page.locator('.inventory_item_price')).toHaveText(productPrice);

  // Checkout
  await page.click('#checkout');
  await page.fill('#first-name', 'Shoaiba');
  await page.fill('#last-name', 'Razzak');
  await page.fill('#postal-code', '1207');
  await page.click('#continue');

  // Verify overview
  await expect(page.locator('.inventory_item_name')).toHaveText(productName);
  await expect(page.locator('.summary_subtotal_label'))
    .toContainText(productPrice.replace('$', ''));

  // Finish order
  await page.click('#finish');
  await expect(page.locator('.complete-header'))
    .toHaveText('Thank you for your order!');

  // Reset App State and Logout
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#logout_sidebar_link');
});