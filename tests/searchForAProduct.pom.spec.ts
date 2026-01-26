import { test, expect } from '@playwright/test';
import { testData } from '../test-data/dataProducts';
import { SearchForAProductPage } from '../pageObjects/searchForAProduct.page';

test.describe('Search (POM)', () => {
    let searchPage: SearchForAProductPage;

    test.beforeEach(async ({ page }) => {
        searchPage = new SearchForAProductPage(page);
        await searchPage.goto();
    });

    test('Happy Path - Search shows matching results', async ({ page }) => {
        await expect(searchPage.searchInput).toBeVisible();

        await searchPage.search(testData.search.validItem);

        const productCount = await searchPage.productCount();
        expect(productCount).toBeGreaterThan(0);
    });

    test('Happy Path - Non-matching search returns no results', async ({ page }) => {
        await searchPage.search(testData.search.invalidItem);
        await expect(searchPage.noResults).toBeVisible();
    });

    test('Negative case - Searching invalid item showing some results', async ({ page }) => {
        await expect(searchPage.searchInput).toBeVisible();

        await searchPage.search(testData.search.invalidItem);

        const productCount = await searchPage.productCount();
        expect(productCount).toBeGreaterThan(0);
    });
});
