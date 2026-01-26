import { test, expect } from "@playwright/test";
import { testData } from "../test-data/dataProducts";
import { setupLoggedInUser } from "../helpers/testSetup";

// Without Page Object Model implementation
test.describe("Add product to cart", () => {

      test.beforeEach(async ({ page }) => {
            await setupLoggedInUser(page);

            await page.waitForTimeout(3000);
            await page.locator(".card-title").first().click();
            await expect(page.locator('[data-test="add-to-cart"]')).toBeEnabled();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.waitForTimeout(2000);
      });

      test('Happy Path: Full checkout flow with shipping and payment', async ({ page }) => {
            await page.locator('[data-test="nav-cart"]').click();

            // Cart Summary 
            await page.locator('[data-test="proceed-1"]').click();

            // Login Check (already logged in)
            await page.locator('[data-test="proceed-2"]').click();

            // Shipping Address (The "requires shipping details" part)
            await page.locator('[data-test="street"]').fill(testData.checkout.address);
            await page.locator('[data-test="city"]').fill(testData.checkout.city);
            await page.locator('[data-test="state"]').fill(testData.checkout.state);
            await page.locator('[data-test="country"]').fill(testData.checkout.country);
            await page.locator('[data-test="postal_code"]').fill(testData.checkout.postcode);
            await page.locator('[data-test="proceed-3"]').click();

            // Payment Method (The "requires payment details" part)
            await expect(page.locator('[data-test="finish"]')).toBeDisabled();

            await page.locator('[data-test="payment-method"]').selectOption('cash-on-delivery');

            //Submit the order
            await page.locator('[data-test="finish"]').click();

            // Verify payment success message
            await expect(page.locator('[data-test="payment-success-message"]')).toBeVisible();

            await page.locator('[data-test="finish"]').click();
        
            // Check for Order Summary/Confirmation
            await expect(page.locator('#order-confirmation')).toContainText('Thanks for your order! Your invoice number is INV-');
        
      });

      test('Negative case: Not providing the required shipping details', async ({ page }) => {
            await page.locator('[data-test="nav-cart"]').click();

            // Cart Summary
            await page.locator('[data-test="proceed-1"]').click();

            // Login Check (already logged in)
            await page.locator('[data-test="proceed-2"]').click();

            // Shipping Address - Require shipping details already filled
            await expect(page.locator('[data-test="street"]')).toBeEmpty();
            await expect(page.locator('[data-test="city"]')).toBeEmpty();
            await expect(page.locator('[data-test="state"]')).toBeEmpty();
            await expect(page.locator('[data-test="country"]')).toBeEmpty();
            await expect(page.locator('[data-test="postal_code"]')).toBeEmpty();
        
      });
});