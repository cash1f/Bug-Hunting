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
    await this.page.goto('/account/favorites', { waitUntil: 'domcontentloaded' });
    // Wait for the backend favorites response to ensure list is populated
    await this.page.waitForResponse(
      res => res.url().includes('/favorites') && res.status() === 200,
      { timeout: 7000 }
    ).catch(() => {});
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
    const deleteButton = card.getByTestId('delete');

    const deletePromise = this.page.waitForResponse(
      res => res.request().method() === 'DELETE' && res.url().includes('/favorites/'),
      { timeout: 7000 }
    ).catch(() => null);

    await deleteButton.click();
    await deletePromise;
    await expect(card).toHaveCount(0);
  }
}
