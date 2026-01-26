import { test, expect } from '@playwright/test';
import { testData } from '../test-data/dataProducts';
import { ViewOrderHistoryPage } from '../pageObjects/viewOrderHistory.page';

test.describe('View Order History (POM)', () => {
    let orders: ViewOrderHistoryPage;

    test.beforeEach(async ({ page }) => {
        orders = new ViewOrderHistoryPage(page);
        await orders.gotoLogin();
    });

    test('Happy Path: View order history after completing a purchase', async ({ page }) => {
        await orders.login(testData.user.email, testData.user.password);

        await page.waitForTimeout(2000);
        await orders.openInvoices();

        await expect(orders.pageTitle).toContainText('Invoices');

        const invoiceRow = orders.firstInvoiceRow();
        await expect(invoiceRow).toBeVisible();

        const invoiceDate = orders.invoiceDate(invoiceRow);
        const invoiceTotal = orders.invoiceTotal(invoiceRow);

        await expect(invoiceDate).not.toBeEmpty();
        await expect(invoiceTotal).toContainText('$');
    
        await orders.openFirstInvoice();

        await expect(orders.downloadInvoiceButton).toBeEnabled();

        await expect(orders.generalInfoHeader).toContainText('General Information');
        await expect(orders.productsHeader).toContainText('Products');
    });

    test('Negative: User with no orders sees a clear message', async ({ page }) => {
        await orders.login(testData.noOrdersUser.email, testData.noOrdersUser.password);

        await page.waitForTimeout(2000);
        await orders.openInvoices();

        const invoiceCount = await orders.invoiceRowCount();
        expect(invoiceCount).toBeGreaterThan(0);
    });
});
