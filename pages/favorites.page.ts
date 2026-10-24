import { Page, Locator, expect } from '@playwright/test';

export class FavoritesPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly favoriteCards: Locator;
  readonly deleteButtons: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: /Favorites/i });
    this.favoriteCards = page.locator('[data-test^="favorite-"]');
    this.deleteButtons = page.getByTestId('delete');
    this.emptyMessage = page.getByText('There are no favorites yet.');
  }

  async goto() {
    await this.page.goto('/account/favorites');
  }

  async getFavoriteTitles(): Promise<string[]> {
    const count = await this.favoriteCards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.favoriteCards.nth(i);
      const title = await card.locator('.card-title, h5').textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    return titles;
  }

  async removeFavoriteByName(name: string) {
    const card = this.favoriteCards.filter({ hasText: name });
    await card.getByTestId('delete').click();
    await expect(card).toHaveCount(0);
  }
}
