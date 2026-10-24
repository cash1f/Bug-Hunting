import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profile.page';
import { LoginPage } from '../pages/login.page';
import { profileData } from '../test-data/users';
import { createAndLoginCustomer } from '../helpers/auth';

test.describe('Step 05 - Customer Profile', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
  });

  test('PRF-01: Update first name and last name persists after reload', { tag: '@smoke' }, async ({ page }) => {
    await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.updateName(
      profileData.updatedNames.firstName,
      profileData.updatedNames.lastName
    );

    // Verify confirmation banner appears
    await expect(profilePage.successAlert).toBeVisible();
    await expect(profilePage.successAlert).toContainText('Your profile is successfully updated!');

    // Reload page and confirm persisted values
    await page.reload();
    await expect(profilePage.firstNameInput).toHaveValue(profileData.updatedNames.firstName, { timeout: 10000 });
    await expect(profilePage.lastNameInput).toHaveValue(profileData.updatedNames.lastName);
  });

  test('PRF-02: Update phone and address fields persists after reload', { tag: '@smoke' }, async ({ page }) => {
    await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.updateContactAndAddress(profileData.updatedAddress);

    // Verify confirmation banner appears
    await expect(profilePage.successAlert).toBeVisible();
    await expect(profilePage.successAlert).toContainText('Your profile is successfully updated!');

    // Reload page and confirm updated address persists
    await page.reload();
    await expect(profilePage.phoneInput).toHaveValue(profileData.updatedAddress.phone, { timeout: 10000 });
    await expect(profilePage.streetInput).toHaveValue(profileData.updatedAddress.street);
    await expect(profilePage.postalCodeInput).toHaveValue(profileData.updatedAddress.postalCode);
    await expect(profilePage.cityInput).toHaveValue(profileData.updatedAddress.city);
    await expect(profilePage.stateInput).toHaveValue(profileData.updatedAddress.state);
    await expect(profilePage.countryInput).toHaveValue(profileData.updatedAddress.country);
  });

  test('PRF-03: Invalid phone number format triggers validation error', { tag: '@regression' }, async ({ page }) => {
    await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.updateContactAndAddress({
      phone: profileData.invalidPhone
    });

    // Verify validation warning for phone number format
    await expect(profilePage.errorAlert).toBeVisible();
    await expect(profilePage.errorAlert).toContainText(/Please enter a valid phone number/i);
  });

  test('PRF-04: City field accepts maximum boundary length of 40 characters', { tag: '@regression' }, async ({ page }) => {
    await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.updateContactAndAddress({
      city: profileData.cityMax40
    });

    // Verify 40-character city is accepted without length rejection error
    await expect(profilePage.successAlert).toBeVisible();
    await expect(profilePage.cityInput).toHaveValue(profileData.cityMax40);
  });

  test('PRF-05: City field exceeding maximum boundary of 40 characters triggers rejection', { tag: '@regression' }, async ({ page }) => {
    await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.updateContactAndAddress({
      city: profileData.cityExceedsMax41
    });

    // Verify validation error for exceeding 40 character limit
    await expect(profilePage.errorAlert).toBeVisible();
    await expect(profilePage.errorAlert).toContainText(/Please correct the highlighted fields|greater than 40/i);
  });

  test('PRF-06: Changing password to the current password is rejected', { tag: '@regression' }, async ({ page }) => {
    const customer = await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.changePassword(
      customer.password,
      customer.password,
      customer.password
    );

    // Verify rejection message when reusing existing password
    await expect(profilePage.errorAlert).toBeVisible();
    await expect(profilePage.errorAlert).toContainText('New Password cannot be same as your current password.');
  });

  test('PRF-07: Changing password to a new valid password logs user out automatically', { tag: '@smoke' }, async ({ page }) => {
    const customer = await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.changePassword(
      customer.password,
      profileData.newValidPassword,
      profileData.newValidPassword
    );

    // Verify password update message and user is logged out (Sign in button visible)
    await expect(profilePage.successAlert).toBeVisible();
    await expect(page.getByTestId('nav-sign-in')).toBeVisible();
  });

  test('PRF-08: Customer can log in with new password while old password fails', { tag: '@regression' }, async ({ page }) => {
    const customer = await createAndLoginCustomer(page);
    await profilePage.goto();

    await profilePage.changePassword(
      customer.password,
      profileData.newValidPassword,
      profileData.newValidPassword
    );
    await expect(profilePage.successAlert).toBeVisible();

    // Navigate to login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify new password successfully logs in
    await loginPage.login(customer.email, profileData.newValidPassword);
    await expect(page).toHaveURL(/.*account/);
    await expect(loginPage.navMenu).toBeVisible();

    // Log out from user session
    await loginPage.logout();
    await expect(page).toHaveURL(/.*auth\/login/);

    // Verify old password is now rejected
    await loginPage.login(customer.email, customer.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
  });
});
