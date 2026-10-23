import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../pages/product-detail.page';
import { FavoritesPage } from '../pages/favorites.page';
import { LoginPage } from '../pages/login.page';
import { favoritesData } from '../test-data/users';
import { createAndLoginCustomer } from '../helpers/auth';

test.describe('Step 06 - Customer Favorites', () => {
  let productDetailPage: ProductDetailPage;
  let favoritesPage: FavoritesPage;

  test.beforeEach(async ({ page }) => {
    productDetailPage = new ProductDetailPage(page);
    favoritesPage = new FavoritesPage(page);
  });

  test('FAV-01: Add a favorite from the detail page', { tag: '@smoke' }, async ({ page }) => {
    await createAndLoginCustomer(page);

    await page.goto('/');
    await page.waitForResponse(res => res.url().includes('/products'));
    await page.locator('.card').first().click();
    await page.waitForURL(/.*product\/.*/);

    const productName = (await productDetailPage.productName.textContent())?.trim() || '';
    await productDetailPage.addToFavorites();

    // Verify success toast appears
    await expect(productDetailPage.toastMessage.filter({ hasText: favoritesData.messages.added })).toBeVisible();

    // Verify product is listed on Favorites page
    await favoritesPage.goto();
    const favoriteTitles = await favoritesPage.getFavoriteTitles();
    expect(favoriteTitles).toContain(productName);
  });

  test('FAV-02: Add a favorite from the listing', { tag: '@regression' }, async ({ page }) => {
    await createAndLoginCustomer(page);

    await page.goto('/');
    await page.waitForResponse(res => res.url().includes('/products'));

    // Catalog card does not have a direct favorite button
    const firstCard = page.locator('.card').first();
    await expect(firstCard.getByTestId('add-to-favorites')).toHaveCount(0);

    // Clicking card opens detail page where favorite action is available
    await firstCard.click();
    await page.waitForURL(/.*product\/.*/);
    await expect(productDetailPage.addToFavoritesButton).toBeVisible();
  });

  test('FAV-03: Add several, remove one', { tag: '@smoke' }, async ({ page }) => {
    await createAndLoginCustomer(page);

    const addedTitles: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page.goto('/');
      await page.waitForResponse(res => res.url().includes('/products'));
      await page.locator('.card').nth(i).click();
      await page.waitForURL(/.*product\/.*/);

      const title = (await productDetailPage.productName.textContent())?.trim() || '';
      addedTitles.push(title);

      await productDetailPage.addToFavorites();
      await expect(productDetailPage.toastMessage.filter({ hasText: favoritesData.messages.added })).toBeVisible();
    }

    await favoritesPage.goto();
    let currentTitles = await favoritesPage.getFavoriteTitles();
    for (const title of addedTitles) {
      expect(currentTitles).toContain(title);
    }

    // Remove the first product from favorites
    const titleToRemove = addedTitles[0];
    await favoritesPage.removeFavoriteByName(titleToRemove);

    // Verify only the removed one is gone
    currentTitles = await favoritesPage.getFavoriteTitles();
    expect(currentTitles).not.toContain(titleToRemove);
    expect(currentTitles).toContain(addedTitles[1]);
    expect(currentTitles).toContain(addedTitles[2]);
  });

  test('FAV-04: Add the same product twice', { tag: '@regression' }, async ({ page }) => {
    await createAndLoginCustomer(page);

    await page.goto('/');
    await page.waitForResponse(res => res.url().includes('/products'));
    await page.locator('.card').first().click();
    await page.waitForURL(/.*product\/.*/);

    const productName = (await productDetailPage.productName.textContent())?.trim() || '';

    // First addition succeeds
    await productDetailPage.addToFavorites();
    await expect(productDetailPage.toastMessage.filter({ hasText: favoritesData.messages.added })).toBeVisible();

    // Second addition is rejected with duplicate message
    await productDetailPage.addToFavorites();
    await expect(productDetailPage.toastMessage.filter({ hasText: favoritesData.messages.alreadyAdded })).toBeVisible();

    // Verify it appears only once in the favorites list
    await favoritesPage.goto();
    const titles = await favoritesPage.getFavoriteTitles();
    const count = titles.filter(t => t === productName).length;
    expect(count).toBe(1);
  });

  test('FAV-05: Favorites persist after logout and login', { tag: '@smoke' }, async ({ page }) => {
    const customer = await createAndLoginCustomer(page);

    await page.goto('/');
    await page.waitForResponse(res => res.url().includes('/products'));
    await page.locator('.card').first().click();
    await page.waitForURL(/.*product\/.*/);

    const productName = (await productDetailPage.productName.textContent())?.trim() || '';
    await productDetailPage.addToFavorites();
    await expect(productDetailPage.toastMessage.filter({ hasText: favoritesData.messages.added })).toBeVisible();

    // Log out
    const loginPage = new LoginPage(page);
    await loginPage.logout();

    // Log back in with the same customer
    await loginPage.goto();
    await loginPage.login(customer.email, customer.password);
    await expect(page).toHaveURL(/.*account/);

    // Verify favorite persists
    await favoritesPage.goto();
    const titles = await favoritesPage.getFavoriteTitles();
    expect(titles).toContain(productName);
  });

  test('FAV-06: Favorite when logged out', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    await page.waitForResponse(res => res.url().includes('/products'));
    await page.locator('.card').first().click();
    await page.waitForURL(/.*product\/.*/);

    await productDetailPage.addToFavorites();
    await expect(productDetailPage.toastMessage.filter({ hasText: favoritesData.messages.unauthorized })).toBeVisible();
  });

  test('FAV-07: Unavailable product', { tag: '@regression' }, async ({ page }) => {
    await productDetailPage.goto(favoritesData.invalidProductId);

    // Verify favorite action is not available on unavailable product URL
    await expect(productDetailPage.addToFavoritesButton).not.toBeVisible();
  });
});
