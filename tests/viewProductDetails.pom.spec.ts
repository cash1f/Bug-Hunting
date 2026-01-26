import { test, expect } from '@playwright/test';
import { ViewProductDetailsPage } from '../pageObjects/viewProductDetails.page';

test.describe('View Product Details (POM)', () => {
    let details: ViewProductDetailsPage;

    test.beforeEach(async ({ page }) => {
        details = new ViewProductDetailsPage(page);
        await details.goto();
    });

    test('Happy Path: Detail information of a product', async ({ page }) => {
        await details.openFirstProduct();
        await expect(details.productName).toBeVisible();
        await expect(details.productDescription).toBeVisible();
        await expect(details.unitPrice).toBeVisible();
        await expect(details.addToCartButton).toBeVisible();
        await expect(details.addToCartButton).toBeEnabled();
    });

    test('Negative: Add to cart button is disabled', async ({ page }) => {
        await details.openFirstProduct();
        await expect(details.addToCartButton).toBeDisabled();
    });
});
