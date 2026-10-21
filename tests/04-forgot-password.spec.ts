import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { LoginPage } from '../pages/login.page';
import { registrationData, forgotPasswordData } from '../test-data/users';
import { registerFreshCustomer } from '../helpers/auth';

test.describe('Step 04 - Forgot Password', () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
  });

  test('FPW-01: Reset with existing email shows confirmation message', { tag: '@smoke' }, async ({ page }) => {
    const customer = await registerFreshCustomer(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestPasswordReset(customer.email);

    // Verify confirmation alert is visible after requesting password reset
    await expect(forgotPasswordPage.successAlert).toBeVisible();
    await expect(forgotPasswordPage.successAlert).toContainText(/confirm|success|password/i);
  });

  test('FPW-02: Customer can log in with new password immediately after reset', { tag: '@smoke' }, async ({ page }) => {
    const customer = await registerFreshCustomer(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestPasswordReset(customer.email);
    await expect(forgotPasswordPage.successAlert).toBeVisible();

    // Verify user can authenticate with the default demo reset password
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(customer.email, forgotPasswordData.resetPasswordValue);

    await expect(page).toHaveURL(/.*account/);
    await expect(loginPage.navMenu).toBeVisible();
  });

  test('FPW-03: Old password fails to authenticate after password reset', { tag: '@regression' }, async ({ page }) => {
    const customer = await registerFreshCustomer(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestPasswordReset(customer.email);
    await expect(forgotPasswordPage.successAlert).toBeVisible();

    // Verify previous password was invalidated and cannot be used
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(customer.email, customer.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
  });

  test('FPW-04: Reset with unknown email displays clear error message', { tag: '@smoke' }, async () => {
    await forgotPasswordPage.requestPasswordReset(forgotPasswordData.unknownEmail);

    // Verify application returns error banner for unregistered email
    await expect(forgotPasswordPage.errorMessage).toBeVisible();
    await expect(forgotPasswordPage.errorMessage).toContainText('The selected email is invalid.');
  });

  test('FPW-05: Reset with empty email triggers required validation error', { tag: '@regression' }, async () => {
    await forgotPasswordPage.requestPasswordReset('');

    // Verify field validation warning appears when email input is empty
    await expect(forgotPasswordPage.emailError).toBeVisible();
    await expect(forgotPasswordPage.emailError).toContainText('Email is required');
  });

  test('FPW-06: Reset with invalid email format displays validation error', { tag: '@regression' }, async () => {
    await forgotPasswordPage.requestPasswordReset(forgotPasswordData.invalidEmailFormat);

    // Verify validation warning displays when format does not match email pattern
    await expect(forgotPasswordPage.emailError).toBeVisible();
  });

  test('FPW-07: Forgot password link on login page navigates to reset page', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();

    // Verify navigation from login to forgot password URL
    await expect(page).toHaveURL(/.*auth\/forgot-password/);
    await expect(forgotPasswordPage.emailInput).toBeVisible();
  });
});
