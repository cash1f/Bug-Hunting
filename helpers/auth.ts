import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { defaultUsers, registrationData } from '../test-data/users';
import { testAddresses } from '../test-data/addresses';

export async function loginAsCustomer(page: Page, user = defaultUsers.customer2) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await expect(page).toHaveURL(/.*account/);
}

export async function loginAsAdmin(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(defaultUsers.admin.email, defaultUsers.admin.password);
  await expect(page).toHaveURL(/.*account/);
}

export async function ensureLoggedOut(page: Page) {
  const loginPage = new LoginPage(page);
  const isMenuVisible = await loginPage.navMenu.isVisible().catch(() => false);
  if (isMenuVisible) {
    await loginPage.logout();
  }
}

// Registers a dynamic, isolated customer to prevent modifying static accounts or colliding in parallel runs
export async function registerFreshCustomer(page: Page) {
  const registerPage = new RegisterPage(page);
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 100000);
  const customer = {
    firstName: registrationData.validUser.firstName,
    lastName: registrationData.validUser.lastName,
    dob: registrationData.validUser.dob,
    phone: registrationData.validUser.phone,
    password: registrationData.validUser.password,
    country: testAddresses.netherlands.country,
    postalCode: testAddresses.netherlands.postcode,
    houseNumber: testAddresses.netherlands.houseNumber,
    state: testAddresses.netherlands.state,
    email: `customer_${timestamp}_${randomSuffix}@practicesoftwaretesting.com`
  };

  await registerPage.goto();
  await registerPage.register(customer);
  await expect(page).toHaveURL(/.*auth\/login/, { timeout: 15000 });
  return customer;
}

// Registers a fresh customer and authenticates them into the account dashboard
export async function createAndLoginCustomer(page: Page) {
  const customer = await registerFreshCustomer(page);
  const loginPage = new LoginPage(page);
  await loginPage.login(customer.email, customer.password);
  await expect(page).toHaveURL(/.*account/, { timeout: 15000 });
  return customer;
}

