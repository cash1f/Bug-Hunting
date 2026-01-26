import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly navMenu: Locator;
  readonly navSignOut: Locator;
  readonly navSignIn: Locator;
  readonly navHome: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.navMenu = page.locator('[data-test="nav-menu"]');
    this.navSignOut = page.locator('[data-test="nav-sign-out"]');
    this.navSignIn = page.locator('[data-test="nav-sign-in"]');
    this.navHome = page.locator('[data-test="nav-home"]');
  }

  async gotoLogin() {
    await this.page.goto('auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async openMenu() {
    await this.navMenu.click();
  }

  async signOut() {
    await this.navSignOut.click();
  }

  async goHome() {
    await this.navHome.click();
  }
}
