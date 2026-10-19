import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { defaultUsers } from '../test-data/users';

test.describe('Step 03 - Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('LOG-01: Valid customer login redirects to account dashboard', { tag: '@smoke' }, async ({ page }) => {
    const user = defaultUsers.customer2;
    await loginPage.login(user.email, user.password);

    // Should redirect to account page and display user name in header menu
    await expect(page).toHaveURL(/.*account/);
    await expect(loginPage.navMenu).toContainText(user.name);
  });

  test('LOG-02: Wrong password shows invalid credentials error', { tag: '@smoke' }, async ({ page }) => {
    await loginPage.login(defaultUsers.customer2.email, 'wrongpassword123');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('LOG-03: Unknown email shows invalid credentials error', { tag: '@regression' }, async ({ page }) => {
    await loginPage.login('unknown_user_9999@example.com', 'welcome01');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('LOG-04: Disabled or locked account is blocked from login', { tag: '@regression' }, async () => {
    test.info().annotations.push({
      type: 'dependency',
      description: 'Tested fully in Step 09 (Locked Account). Verifies locked account error message.'
    });

    test.skip(true, 'Full state transition tested in Step 09 (Locked Account)');
  });

  test('LOG-05: Empty email and password trigger validation errors', { tag: '@regression' }, async () => {
    await loginPage.login('', '');

    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('LOG-06: Logout from menu returns user to logged-out state', { tag: '@smoke' }, async ({ page }) => {
    const user = defaultUsers.customer2;
    await loginPage.login(user.email, user.password);
    await expect(loginPage.navMenu).toContainText(user.name);

    await loginPage.logout();

    // After logout, user menu is replaced with Sign In link
    await expect(loginPage.navSignIn).toBeVisible();
    await page.goto('/account');
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  // Data-driven negative and edge cases (Error Guessing / Equivalence Partitioning)
  const edgeCases = [
    {
      id: 'LOG-07',
      name: 'Email with uppercase letters is processed correctly',
      email: defaultUsers.customer2.email.toUpperCase(),
      password: defaultUsers.customer2.password,
      expected: 'success'
    },
    {
      id: 'LOG-08',
      name: 'Email with leading and trailing spaces is trimmed and logs in',
      email: `  ${defaultUsers.customer2.email}  `,
      password: defaultUsers.customer2.password,
      expected: 'success'
    },
    {
      id: 'LOG-09',
      name: 'SQL injection attempt in email fails safely without 500 error',
      email: "' OR '1'='1",
      password: 'password',
      expected: 'error'
    }
  ];

  for (const row of edgeCases) {
    test(`${row.id}: ${row.name}`, { tag: '@regression' }, async ({ page }) => {
      await loginPage.login(row.email, row.password);

      if (row.expected === 'success') {
        await expect(loginPage.navMenu).toContainText(defaultUsers.customer2.name);
      } else {
        // Must show error (invalid credentials or invalid email format) and stay on login page
        await expect(loginPage.errorMessage.or(loginPage.emailFormatError)).toBeVisible();
        await expect(page).toHaveURL(/.*auth\/login/);
      }
    });
  }

  test('LOG-10: Opening account URL directly while logged out redirects to login', { tag: '@regression' }, async ({ page }) => {
    // Navigate directly to protected account page
    await page.goto('/account');

    // Route guard checks auth status and redirects unauthenticated user to login
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 15000 });
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
  });
});
