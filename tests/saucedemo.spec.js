import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const PASSWORD = 'secret_sauce';


test('Q2: Standard user complete purchase journey', async ({ page }) => {
  await page.goto(BASE_URL);

  // Login
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');

  // Reset App State
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#react-burger-cross-btn');

  // Add any 3 products
  const items = page.locator('.inventory_item');
  await items.nth(0).locator('button').click();
  await items.nth(1).locator('button').click();
  await items.nth(2).locator('button').click();

  // Go to cart
  await page.click('.shopping_cart_link');
  await expect(page.locator('.cart_item')).toHaveCount(3);

  // Capture product names & prices
  const productNames = await page.locator('.inventory_item_name').allTextContents();
  const prices = await page.locator('.inventory_item_price').allTextContents();

  const totalPrice = prices
    .map(p => Number(p.replace('$', '')))
    .reduce((a, b) => a + b, 0)
    .toFixed(2);

  // Checkout
  await page.click('#checkout');
  await page.fill('#first-name', 'Shoaiba');
  await page.fill('#last-name', 'Razzak');
  await page.fill('#postal-code', '1207');
  await page.click('#continue');

  // Verify product names
  const overviewNames = await page.locator('.inventory_item_name').allTextContents();
  expect(overviewNames).toEqual(productNames);

  // Verify total price
  await expect(page.locator('.summary_subtotal_label'))
    .toContainText(totalPrice);

  // Finish order
  await page.click('#finish');
  await expect(page.locator('.complete-header'))
    .toHaveText('Thank you for your order!');

  // Reset App State and Logout
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#logout_sidebar_link');
});

