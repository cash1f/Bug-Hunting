import { test, expect } from '@playwright/test';
import { setupLoggedInUser } from '../helpers/testSetup';
import { CartPage } from '../pageObjects/cart.page';

test.describe('Add product to cart (POM)', () => {
    let cart: CartPage;

    test.beforeEach(async ({ page }) => {
        await setupLoggedInUser(page);
        cart = new CartPage(page);

        await page.waitForTimeout(3000);
        await cart.gotoHome();
        await page.waitForTimeout(3000);
        await cart.openFirstProductAndAddToCart();
        await page.waitForTimeout(2000);
    });

    test('Happy path: Removing item from cart', async ({ page }) => {
        await cart.openCart();
        await page.waitForTimeout(2000);

        await cart.removeFirstItem();
        await expect(cart.tableLocator).not.toBeVisible();
    });

    test('Happy path: Increase quantity', async ({ page }) => {
        await cart.addToCartButton.click();
        await page.waitForTimeout(2000);
        await cart.openCart();
        await expect(cart.productQuantity).toHaveValue('2');
    });

    test('Happy path: adding quantity should update the total', async ({ page }) => {
        await cart.openCart();
        const initialTotal = await cart.getCartTotalNumber();

        await cart.setQuantity('2');
        await cart.clickOutsideToUpdate();

        await expect.poll(async () => await cart.getCartTotalNumber()).toBeGreaterThan(initialTotal);
    });

    test('Negative case: adding quantity should update the total', async ({ page }) => {
        await cart.openCart();
        const initialTotal = await cart.getCartTotalNumber();

        await cart.setQuantity('2');

        await expect.poll(async () => await cart.getCartTotalNumber()).toBeGreaterThan(initialTotal);
    });
});
