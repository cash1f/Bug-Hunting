import { Page, Locator } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successAlert: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Your email');
    this.submitButton = page.getByTestId('forgot-password-submit');
    this.successAlert = page.locator('.alert-success');
    this.errorMessage = page.locator('.alert-danger:not([data-test="email-error"])');
    this.emailError = page.getByTestId('email-error');
  }

  async goto() {
    await this.page.goto('/auth/forgot-password', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async requestPasswordReset(email: string) {
    if (email !== '') {
      await this.emailInput.fill(email);
    } else {
      await this.emailInput.clear();
    }
    await this.submitButton.click();
  }
}
