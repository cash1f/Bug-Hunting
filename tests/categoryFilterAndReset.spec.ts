import { test, expect } from '@playwright/test';
import { testData } from "../test-data/dataProducts";

test.describe('Category Filtering and Reset', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-test="nav-home"]').click();
    });

    test('should filter products and keep pagination working', async ({ page }) => {
    
      await page.locator('[data-test="nav-home"]').click();

      // Apply category filter
      const handToolsCheckbox = page.getByLabel(testData.categories.handTools);
      await handToolsCheckbox.check();

      // Confirm products are visible
      const products = page.locator('.card');
      await expect(products.first()).toBeVisible();

      // Go to next page
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Page-1' }).click();

      // Confirm products still show after pagination
      await expect(products.first()).toBeVisible();
    });

    test('should keep selected filter after page refresh', async ({ page }) => {
    //Failing test to verify filter persistence after page reload
      // const powerToolsCheckbox = page.getByLabel(testData.categories.powerTools);
      // await powerToolsCheckbox.check();
      page.getByLabel(testData.categories.powerTools).check();
    
      // Refresh page
      await page.waitForTimeout(800);
      await page.reload();

      // Check category is still selected and will fail
      await expect(page.getByLabel(testData.categories.powerTools)).toHaveClass(/active/);

    
    });

    test('should keep selected filter after navigating back', async ({ page }) => {
      //Failing test to verify filter persistence after navigation
      // await page.click('text=Power Tools');
      await page.getByLabel(testData.categories.powerTools).check();
      await page.waitForTimeout(800); 
      // Open first product
      await page.locator('.card').first().click();

      // Go back to shop page
      await page.goBack();

      // Check filter is still applied
      await expect(page.getByLabel(testData.categories.powerTools)).toBeChecked();
    });

//   test('should restore full list when Clear Filters is clicked', async ({ page }) => {
   
//     // There is no "Clear Filters" button
//   });

});
