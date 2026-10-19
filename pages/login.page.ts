import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly emailFormatError: Locator;
  readonly passwordError: Locator;
  readonly navMenu: Locator;
  readonly navSignOut: Locator;
  readonly navSignIn: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators follow hierarchy: getByPlaceholder / getByLabel / getByTestId
    this.emailInput = page.getByPlaceholder('Your email');
    this.passwordInput = page.getByPlaceholder('Your password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('login-error');
    this.emailError = page.getByText('Email is required');
    this.emailFormatError = page.getByText('Email format is invalid');
    this.passwordError = page.getByText('Password is required');
    this.navMenu = page.getByTestId('nav-menu');
    this.navSignOut = page.getByTestId('nav-sign-out');
    this.navSignIn = page.getByTestId('nav-sign-in');
  }

  async goto() {
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async login(email: string, password: string) {
    if (email !== '') {
      await this.emailInput.fill(email);
    } else {
      await this.emailInput.clear();
    }

    if (password !== '') {
      await this.passwordInput.fill(password);
    } else {
      await this.passwordInput.clear();
    }

    await this.loginButton.click();
  }

  async logout() {
    await this.navMenu.click();
    await this.navSignOut.click();
  }
}
