import { Page, Locator, expect } from '@playwright/test';

export interface ProfileAddressUpdate {
  phone?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

export class ProfilePage {
  readonly page: Page;

  // Profile details form locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly streetInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countryInput: Locator;
  readonly updateProfileButton: Locator;

  // Change password form locators
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly newPasswordConfirmInput: Locator;
  readonly changePasswordButton: Locator;

  // Notification alerts
  readonly successAlert: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    // Profile form elements
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.emailInput = page.getByTestId('email');
    this.phoneInput = page.getByTestId('phone');
    this.streetInput = page.getByTestId('street');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.countryInput = page.getByTestId('country');
    this.updateProfileButton = page.getByTestId('update-profile-submit');

    // Password form elements
    this.currentPasswordInput = page.getByTestId('current-password');
    this.newPasswordInput = page.getByTestId('new-password');
    this.newPasswordConfirmInput = page.getByTestId('new-password-confirm');
    this.changePasswordButton = page.getByTestId('change-password-submit');

    // Alerts
    this.successAlert = page.locator('.alert-success');
    this.errorAlert = page.locator('.alert-danger');
  }

  async goto() {
    await this.page.goto('/account/profile');
    await expect(this.firstNameInput).not.toHaveValue('', { timeout: 10000 });
  }

  async updateName(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.updateProfileButton.click();
  }

  async updateContactAndAddress(data: ProfileAddressUpdate) {
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.street !== undefined) await this.streetInput.fill(data.street);
    if (data.postalCode !== undefined) await this.postalCodeInput.fill(data.postalCode);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.country !== undefined) await this.countryInput.fill(data.country);

    await this.updateProfileButton.click();
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.newPasswordConfirmInput.fill(confirmPassword);
    await this.changePasswordButton.click();
  }
}
