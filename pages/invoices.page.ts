import { Page, Locator } from '@playwright/test';

export class InvoicesPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly invoiceRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Invoices' });
    this.invoiceRows = page.locator('tbody tr');
  }

  async goto() {
    await this.page.goto('/account/invoices');
  }

  async getFirstInvoiceNumber(): Promise<string> {
    const text = await this.invoiceRows.first().locator('td').nth(0).textContent();
    return text ? text.trim() : '';
  }

  async getFirstInvoiceDate(): Promise<string> {
    const text = await this.invoiceRows.first().locator('td').nth(2).textContent();
    return text ? text.trim() : '';
  }

  async getFirstInvoiceTotal(): Promise<string> {
    const text = await this.invoiceRows.first().locator('td').nth(3).textContent();
    return text ? text.trim() : '';
  }

  async openFirstInvoiceDetails() {
    await this.invoiceRows.first().getByRole('link', { name: 'Details' }).click();
  }

  async getFirstInvoiceDetailsHref(): Promise<string> {
    const href = await this.invoiceRows.first().getByRole('link', { name: 'Details' }).getAttribute('href');
    return href || '';
  }
}
