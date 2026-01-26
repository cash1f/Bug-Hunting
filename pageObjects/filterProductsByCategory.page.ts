import { Page, Locator } from '@playwright/test';

export class FilterProductsByCategoryPage {
  readonly page: Page;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.card');
  }

  async goto() {
    await this.page.goto('/');
  }

  getCategoryCheckbox(label: string) {
    return this.page.getByLabel(label);
  }

  async waitForCards() {
    await this.page.waitForSelector('.card');
  }

  async countCards() {
    return await this.productCards.count();
  }

  async checkCategory(label: string) {
    await this.getCategoryCheckbox(label).check();
  }

  async uncheckCategory(label: string) {
    await this.getCategoryCheckbox(label).uncheck();
  }
}
