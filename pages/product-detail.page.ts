import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly addToFavoritesButton: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.getByTestId('product-name');
    this.addToFavoritesButton = page.getByTestId('add-to-favorites');
    this.toastMessage = page.locator('.toast-message');
  }

  async goto(productId: string) {
    await this.page.goto(`/product/${productId}`, { waitUntil: 'domcontentloaded' });
  }

  async addToFavorites() {
    const responsePromise = this.page.waitForResponse(
      res => res.url().includes('/favorites'),
      { timeout: 7000 }
    ).catch(() => null);

    await this.addToFavoritesButton.click();
    return await responsePromise;
  }
}
