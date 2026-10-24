import { Page, Locator } from '@playwright/test';

export class InvoiceDetailPage {
  readonly page: Page;
  readonly downloadButton: Locator;
  readonly invoiceNumberInput: Locator;
  readonly invoiceDateInput: Locator;
  readonly totalInput: Locator;
  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.downloadButton = page.getByTestId('download-invoice');
    this.invoiceNumberInput = page.getByTestId('invoice-number');
    this.invoiceDateInput = page.getByTestId('invoice-date');
    this.totalInput = page.getByTestId('total');
    this.notFoundMessage = page.getByText("This invoice doesn't exist.");
  }

  async goto(invoiceUrl: string) {
    await this.page.goto(invoiceUrl);
  }
}
