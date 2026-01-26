import { Page, Locator } from '@playwright/test';

export class ViewOrderHistoryPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly navMenu: Locator;
  readonly navInvoices: Locator;
  readonly pageTitle: Locator;
  readonly invoiceRows: Locator;
  readonly downloadInvoiceButton: Locator;
  readonly generalInfoHeader: Locator;
  readonly productsHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.navMenu = page.locator('[data-test="nav-menu"]');
    this.navInvoices = page.locator('[data-test="nav-invoices"]');
    this.pageTitle = page.locator('[data-test="page-title"]');
    this.invoiceRows = page.locator('table tbody tr');
    this.downloadInvoiceButton = page.locator('[data-test="download-invoice"]');
    this.generalInfoHeader = page.locator('h3').first();
    this.productsHeader = page.locator('h3').last();
  }

  async gotoLogin() {
    await this.page.goto('auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async openInvoices() {
    await this.navMenu.click();
    await this.navInvoices.click();
  }

  firstInvoiceRow() {
    return this.invoiceRows.first();
  }

  invoiceDate(row: Locator) {
    return row.locator('td').nth(2);
  }

  invoiceTotal(row: Locator) {
    return row.locator('td').nth(3);
  }

  async openFirstInvoice() {
    await this.firstInvoiceRow().getByRole('link').first().click();
  }

  async invoiceRowCount() {
    return await this.invoiceRows.count();
  }
}
