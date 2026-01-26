import { Page, Locator } from '@playwright/test';

export class ViewProductDetailsPage {
  readonly page: Page;
  readonly productTitleLinks: Locator;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly unitPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitleLinks = page.locator('.card-title');
    this.productName = page.locator('[data-test="product-name"]');
    this.productDescription = page.locator('[data-test="product-description"]');
    this.unitPrice = page.locator('[data-test="unit-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openFirstProduct() {
    await this.productTitleLinks.first().click();
  }

  async isAddToCartEnabled() {
    return await this.addToCartButton.isEnabled();
  }

  async isAddToCartDisabled() {
    return await this.addToCartButton.isDisabled();
  }
}
