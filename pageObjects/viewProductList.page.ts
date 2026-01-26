import { Page, Locator } from '@playwright/test';

export class ViewProductListPage {
  readonly page: Page;
  readonly filters: Locator;
  readonly productCards: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filters = page.locator('#filters');
    this.productCards = page.locator('.card');
    this.nextButton = page.locator('a[aria-label="Next"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  first() {
    return this.productCards.first();
  }

  async waitForProducts(timeout = 800) {
    await this.page.waitForTimeout(timeout);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async count() {
    return await this.productCards.count();
  }

  imageOf(product: Locator) {
    return product.locator('img');
  }

  titleOf(product: Locator) {
    return product.locator('.card-title');
  }

  priceOf(product: Locator) {
    return product.locator('[data-test="product-price"]');
  }
}
