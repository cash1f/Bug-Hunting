import { test, expect } from '@playwright/test';
import { ViewProductListPage } from '../pageObjects/viewProductList.page';


test.describe('View Product List', () => {

    let list: ViewProductListPage;

    test.beforeEach(async ({ page }) => {
        list = new ViewProductListPage(page);
        await list.goto();
    });

    test('Happy Path: View a list of available tools', async ({ page }) => {

        await expect(list.filters).toContainText('Sort');

        const firstProduct = list.first();
        await expect(list.imageOf(firstProduct)).toBeVisible();

        await expect(list.titleOf(firstProduct)).not.toBeEmpty();
        await expect(list.priceOf(firstProduct)).not.toHaveText('');

        await page.getByRole('button', { name: 'Page-2' }).click();
        await expect(page.getByRole('listitem').filter({ hasText: '«' })).toBeVisible();
    });

    test('Pagination loads more products when clicking Next', async ({ page }) => {
        await list.waitForProducts();
        const firstPageCount = await list.count();
        expect(firstPageCount).toBeGreaterThan(0);

        await expect(list.nextButton).toBeVisible();
        await expect(list.nextButton.locator('span')).toHaveText('»');

        await list.clickNext();

        await list.waitForProducts();

        const secondPageCount = await list.count();
        expect(secondPageCount).toEqual(firstPageCount);
    });

    test('Negative: Next should not be disabled on the first page', async ({ page }) => {
        await expect(list.nextButton).toHaveClass(/disabled/);
    });

});
