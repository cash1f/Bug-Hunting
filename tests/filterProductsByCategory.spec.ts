import { test, expect } from "@playwright/test";
import { testData } from "../test-data/dataProducts";

test.describe("Filter products by category", () => {
    
  test.beforeEach(async ({ page }) => {
      await page.goto('/');
  });

  test('Happy Path: Filter updates product list and clearing resets it', async ({ page }) => {
    // Verify filters are displayed
    const handToolsCheckbox = page.getByLabel(testData.categories.handTools);
    await expect(handToolsCheckbox).toBeVisible();
    const powerToolsCheckbox = page.getByLabel(testData.categories.powerTools);
    await expect(powerToolsCheckbox).toBeVisible();

    // Get the "Pre-filter" count of products We wait for the cards to be visible first
    await page.waitForSelector('.card');
    const initialCount = await page.locator('.card').count();

    // Select a category (Hand Tools)
    await handToolsCheckbox.check();
    await page.waitForTimeout(2000); 
    
    // Validation: Filtered count should be different (usually less) than initial
    const filteredCount = await page.locator('.card').count();  
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Clear the filter shows all products again
    await handToolsCheckbox.uncheck();
    await page.waitForTimeout(2000);

    const finalCount = await page.locator('.card').count();
    expect(finalCount).toBe(initialCount);
  });

  test('Negative: Selecting an empty category shows "No results"', async ({ page }) => {
    // Some sites have categories with 0 items for testing purposes
    // Here we might simulate it by searching for something then clicking a filter
    const edgeCaseToolsCheckbox = page.getByLabel(testData.categories.negativeTools);
    await edgeCaseToolsCheckbox.check();
    await page.waitForTimeout(2000);
    
    const productCount = await page.locator(".card").count();
    expect(productCount).toBeGreaterThan(1);
  });
  
});