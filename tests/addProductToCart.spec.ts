import { test, expect } from '@playwright/test';
// import { testData } from "../test-data/dataProducts";
import { setupLoggedInUser } from "../helpers/testSetup";

test.describe("Add product to cart", () => {
      test.beforeEach(async ({ page }) => {
            await setupLoggedInUser(page);
      });

      test('Happy path: Add correct quantity to Cart', async ({ page }) => {
            await page.locator('.card-title').first().click();
            await expect(page.locator('[data-test="add-to-cart"]')).toBeEnabled();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.waitForTimeout(2000);

            const cartBadge = page.locator('[data-test="cart-quantity"]');
            await expect(cartBadge).toHaveText('2');
      });

      test('Happy path: Item details are correct in Cart', async ({ page }) => {
            await page.locator('.card-title').first().click();
            const productName = ((await page.locator('[data-test="product-name"]').textContent()) ?? '').trim();
            const productQuantity = (await page.locator('[data-test="quantity"]').inputValue()).trim();
            const productPriceRaw = ((await page.locator('[data-test="unit-price"]').textContent()) ?? '').trim();

            const normalizePrice = (s: string) => s.replace(/[^0-9.]/g, '');

            const productPrice = normalizePrice(productPriceRaw);

            await expect(page.locator('[data-test="add-to-cart"]')).toBeEnabled();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.waitForTimeout(2000);

            await page.locator('[data-test="nav-cart"]').click();
            await page.waitForTimeout(2000);

            /*
            await expect(page.locator('[data-test="product-title"]')).toContainText('Pliers');
            await expect(page.locator('[data-test="product-quantity"]')).toHaveValue('1');
            */
            const cartItemName = ((await page.locator('[data-test="product-title"]').textContent()) ?? '').trim();
            const cartItemQuantity = (await page.locator('[data-test="product-quantity"]').inputValue()).trim();  
            const cartItemPriceRaw = ((await page.locator('[data-test="product-price"]').textContent()) ?? '').trim();
            const cartItemPrice = normalizePrice(cartItemPriceRaw);

            expect(cartItemName).toBe(productName);
            expect(cartItemQuantity).toEqual(productQuantity);
            expect(cartItemPrice).toEqual(productPrice);
      });

      test("Product appears in cart summary with correct name, quantity and price", async ({ page }) => {
             // Open first product
            await page.locator(".card-title").first().click();

      // Capture product details from product page
            const productName = ((await page.locator('[data-test="product-name"]').textContent()) ?? '').trim();
            const productPriceRaw = ((await page.locator('[data-test="unit-price"]').textContent()) ?? '').trim();
            const productPrice = productPriceRaw.replace(/[^0-9.]/g, '');
            const productQuantity = (await page.locator('[data-test="quantity"]').inputValue()).trim();

      // Add to cart
            await expect(page.locator('[data-test="add-to-cart"]')).toBeEnabled();
            await page.locator('[data-test="add-to-cart"]').click();

      // Go to cart
            await page.locator('[data-test="nav-cart"]').click();
      // Capture cart values
            const cartItemName = ((await page.locator('[data-test="product-title"]').textContent()) ?? '').trim();
            const cartItemPriceRaw = ((await page.locator('[data-test="product-price"]').textContent()) ?? '').trim();
            const cartItemPrice = cartItemPriceRaw.replace(/[^0-9.]/g, '');
            const cartItemQuantity = (await page.locator('[data-test="product-quantity"]').inputValue()).trim();

      // Assertions
            expect(cartItemName).toBe(productName);
            expect(cartItemPrice).toBe(productPrice);
            expect(cartItemQuantity).toBe(productQuantity);
      });

}); 