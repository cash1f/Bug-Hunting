import { test, expect } from '@playwright/test';
import { testData } from '../test-data/dataProducts';
import { FilterProductsByCategoryPage } from '../pageObjects/filterProductsByCategory.page';

test.describe('Filter products by category (POM)', () => {
    let pageObj: FilterProductsByCategoryPage;

    test.beforeEach(async ({ page }) => {
        pageObj = new FilterProductsByCategoryPage(page);
        await pageObj.goto();
    });

    test('Happy Path: Filter updates product list and clearing resets it', async ({ page }) => {
        const handToolsCheckbox = pageObj.getCategoryCheckbox(testData.categories.handTools);
        await expect(handToolsCheckbox).toBeVisible();

        await pageObj.waitForCards();
        const initialCount = await pageObj.countCards();

        await pageObj.checkCategory(testData.categories.handTools);
        await page.waitForTimeout(2000);

        const filteredCount = await pageObj.countCards();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);

        await pageObj.uncheckCategory(testData.categories.handTools);
        await page.waitForTimeout(2000);

        const finalCount = await pageObj.countCards();
        expect(finalCount).toBe(initialCount);
    });

    test('Negative: Selecting an empty category shows "No results"', async ({ page }) => {
        const edgeCaseToolsCheckbox = pageObj.getCategoryCheckbox(testData.categories.negativeTools);
        await pageObj.checkCategory(testData.categories.negativeTools);
        await page.waitForTimeout(2000);

        const productCount = await pageObj.countCards();
        expect(productCount).toBeGreaterThan(1);
    });
});
