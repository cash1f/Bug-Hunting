import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly navHome: Locator;
  readonly navCart: Locator;
  readonly productTitles: Locator;
  readonly addToCartButton: Locator;
  readonly tableLocator: Locator;
  readonly trashIcon: Locator;
  readonly productQuantity: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navHome = page.locator('[data-test="nav-home"]');
    this.navCart = page.locator('[data-test="nav-cart"]');
    this.productTitles = page.locator('.card-title');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.tableLocator = page.locator('.table');
    this.trashIcon = page.locator('[data-icon="xmark"]');
    this.productQuantity = page.locator('[data-test="product-quantity"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
  }

  async gotoHome() {
    await this.navHome.click();
  }

  async openFirstProductAndAddToCart() {
    await this.productTitles.first().click();
    await this.addToCartButton.click();
  }

  async openCart() {
    await this.navCart.click();
  }

  async removeFirstItem() {
    await this.trashIcon.click();
  }

  async setQuantity(value: string) {
    await this.productQuantity.fill(value);
  }

  async clickOutsideToUpdate() {
    await this.page.click('body');
  }

  async getCartTotalNumber() {
    const txt = await this.cartTotal.innerText();
    return parseFloat(txt.replace('$', ''));
  }

  async getQuantityValue() {
    return await this.productQuantity.inputValue();
  }
}
