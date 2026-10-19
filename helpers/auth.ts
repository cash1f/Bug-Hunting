import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { defaultUsers } from '../test-data/users';

export async function loginAsCustomer(page: Page, user = defaultUsers.customer2) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
}

export async function loginAsAdmin(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(defaultUsers.admin.email, defaultUsers.admin.password);
}

export async function ensureLoggedOut(page: Page) {
  const loginPage = new LoginPage(page);
  const isMenuVisible = await loginPage.navMenu.isVisible().catch(() => false);
  if (isMenuVisible) {
    await loginPage.logout();
  }
}
