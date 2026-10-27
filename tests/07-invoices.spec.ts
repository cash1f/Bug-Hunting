import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { InvoicesPage } from '../pages/invoices.page';
import { InvoiceDetailPage } from '../pages/invoice-detail.page';
import { LoginPage } from '../pages/login.page';
import { defaultUsers, invoicesData } from '../test-data/users';
import { loginAsCustomer } from '../helpers/auth';

test.describe('Step 07 - Customer Invoices', () => {
  let invoicesPage: InvoicesPage;
  let invoiceDetailPage: InvoiceDetailPage;

  test.beforeEach(async ({ page }) => {
    invoicesPage = new InvoicesPage(page);
    invoiceDetailPage = new InvoiceDetailPage(page);
  });

  test('INV-01: Invoice list shown', { tag: '@smoke' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await invoicesPage.goto();

    await expect(invoicesPage.pageTitle).toBeVisible();
    await expect(invoicesPage.invoiceRows.first()).toBeVisible();

    const invoiceNumber = await invoicesPage.getFirstInvoiceNumber();
    expect(invoiceNumber).toMatch(/^INV-\d+$/);
  });

  test('INV-02: Open invoice detail', { tag: '@smoke' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await invoicesPage.goto();

    await invoicesPage.openFirstInvoiceDetails();
    await expect(page).toHaveURL(/.*invoices\/.*/);

    await expect(invoiceDetailPage.invoiceNumberInput).toBeVisible();
    await expect(invoiceDetailPage.downloadButton).toBeVisible();
  });

  test('INV-03: Detail matches list', { tag: '@smoke' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await invoicesPage.goto();

    const listNumber = await invoicesPage.getFirstInvoiceNumber();
    const listDate = await invoicesPage.getFirstInvoiceDate();
    const listTotal = await invoicesPage.getFirstInvoiceTotal();

    await invoicesPage.openFirstInvoiceDetails();

    await expect(invoiceDetailPage.invoiceNumberInput).toHaveValue(listNumber);
    await expect(invoiceDetailPage.invoiceDateInput).toHaveValue(listDate);

    const detailTotal = await invoiceDetailPage.totalInput.inputValue();
    expect(detailTotal.replace(/\s+/g, '')).toBe(listTotal.replace(/\s+/g, ''));
  });

  test('INV-04: Download PDF', { tag: '@smoke' }, async ({ page }) => {
    test.slow(); // Triples timeout to accommodate backend PDF generation queue
    await loginAsCustomer(page, defaultUsers.customer1);
    await invoicesPage.goto();

    const invoiceNumber = await invoicesPage.getFirstInvoiceNumber();
    await invoicesPage.openFirstInvoiceDetails();

    // Accommodate Angular's 20s polling interval if the invoice was recently created
    await expect(invoiceDetailPage.downloadButton).toBeEnabled({ timeout: 25000 });

    const downloadPromise = page.waitForEvent('download');
    await invoiceDetailPage.downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe(`${invoiceNumber}.pdf`);

    const filePath = await download.path();
    const fileBuffer = fs.readFileSync(filePath);
    expect(fileBuffer.length).toBeGreaterThan(0);
    expect(fileBuffer.subarray(0, 5).toString()).toBe(invoicesData.pdfHeader);
  });

  test('INV-05: Invoices when logged out', { tag: '@regression' }, async ({ page }) => {
    await invoicesPage.goto();
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('INV-06: Another customer invoice by URL', { tag: '@regression' }, async ({ page }) => {
    // Collect first invoice link of customer1
    await loginAsCustomer(page, defaultUsers.customer1);
    await invoicesPage.goto();
    const customer1InvoiceHref = await invoicesPage.getFirstInvoiceDetailsHref();

    // Log out customer1
    const loginPage = new LoginPage(page);
    await loginPage.logout();

    // Log in as customer3
    await loginPage.goto();
    await loginPage.login(defaultUsers.customer3.email, defaultUsers.customer3.password);
    await expect(page).toHaveURL(/.*account/);

    // Attempt to access customer1's invoice
    await invoiceDetailPage.goto(customer1InvoiceHref);

    // Verify access is blocked with clear message and no invoice data is displayed
    await expect(invoiceDetailPage.notFoundMessage).toBeVisible();
    await expect(invoiceDetailPage.invoiceNumberInput).toHaveCount(0);
  });
});
