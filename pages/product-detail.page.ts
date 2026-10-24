import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly addToFavoritesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.getByTestId('product-name');
    this.addToFavoritesButton = page.getByTestId('add-to-favorites');
  }

  async goto(productId: string) {
    await this.page.goto(`/product/${productId}`);
  }

  async addToFavorites() {
    await this.addToFavoritesButton.click();
  }
}
