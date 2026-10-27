import { Page, Locator } from '@playwright/test';

export class MessagesPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly table: Locator;
  readonly messageRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Messages' });
    this.table = page.locator('table');
    this.messageRows = page.locator('tbody tr');
  }

  async goto() {
    await this.page.goto('/account/messages');
  }

  async getFirstMessageSubject(): Promise<string> {
    const text = await this.messageRows.first().locator('td').nth(0).textContent();
    return text ? text.trim() : '';
  }

  async getFirstMessageSnippet(): Promise<string> {
    const text = await this.messageRows.first().locator('td').nth(1).textContent();
    return text ? text.trim() : '';
  }

  async getFirstMessageStatus(): Promise<string> {
    const text = await this.messageRows.first().locator('td').nth(2).textContent();
    return text ? text.trim() : '';
  }

  async getFirstMessageDate(): Promise<string> {
    const text = await this.messageRows.first().locator('td').nth(3).textContent();
    return text ? text.trim() : '';
  }

  async openFirstMessageDetails() {
    await this.messageRows.first().getByRole('link', { name: 'Details' }).click();
  }

  async getFirstMessageDetailsHref(): Promise<string> {
    const href = await this.messageRows.first().getByRole('link', { name: 'Details' }).getAttribute('href');
    return href || '';
  }

  async getAllMessageDates(): Promise<string[]> {
    const count = await this.messageRows.count();
    const dates: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.messageRows.nth(i).locator('td').nth(3).textContent();
      if (text) {
        dates.push(text.trim());
      }
    }
    return dates;
  }
}
