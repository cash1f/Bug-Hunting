import { Page, Locator } from '@playwright/test';

export class SearchForAProductPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly noResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.productCards = page.locator('.card');
    this.noResults = page.locator('[data-test="no-results"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async productCount() {
    await this.page.waitForTimeout(800);
    return await this.productCards.count();
  }

  async isNoResultsVisible() {
    return await this.noResults.isVisible();
  }
}
