import { test, expect } from '@playwright/test';
import { testData } from "../test-data/dataProducts";
import { LoginPage } from '../pageObjects/login.page';

const welcomeName = `${testData.user.firstName} ${testData.user.lastName}`;

test.describe('Log in (POM)', () => {
    let login: LoginPage;

    test.beforeEach(async ({ page }) => {
        login = new LoginPage(page);
        await login.gotoLogin();
    });

    test('Negative: Login with empty fields', async ({ page }) => {
        await login.login('', '');
        await expect(page.getByText('Email is required')).toBeVisible();
    });

    test('Negative: Login with invalid credentials', async ({ page }) => {
        await login.login(testData.invalidUser.email, testData.invalidUser.password);
        await expect(page.locator('.alert-danger')).toBeVisible();
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });

    test('Happy Path: Login with valid credentials', async ({ page }) => {
        await login.login(testData.user.email, testData.user.password);
        await expect(login.navMenu).toContainText(welcomeName);
    });

    test('Happy Path: Login persists during navigation', async ({ page }) => {
        await login.login(testData.user.email, testData.user.password);

        await page.waitForTimeout(3000);
        await login.goHome();
        await page.waitForTimeout(3000);
        await expect(login.navMenu).toContainText(welcomeName);

    // Logout to reset state
        await login.openMenu();
        await login.signOut();
        await expect(login.navSignIn).toContainText('Sign in');
    });

    test('Negative Path: Login persists after log out', async ({ page }) => {
        await login.login(testData.user.email, testData.user.password);

        await page.waitForTimeout(3000);
        await login.goHome();
        await page.waitForTimeout(3000);

        // Logout to reset state
        await login.openMenu();
        await login.signOut();

        await expect(login.navMenu).toContainText(welcomeName);
    });
});
