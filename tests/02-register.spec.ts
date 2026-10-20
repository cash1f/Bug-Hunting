import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';
import { defaultUsers, invalidCredentials, registrationData } from '../test-data/users';
import { testAddresses } from '../test-data/addresses';

test.describe('Step 02 - Register', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('REG-01: Valid customer registration redirects to login page and allows login', { tag: '@smoke' }, async ({ page }) => {
    const timestamp = Date.now();
    const newUser = {
      firstName: registrationData.validUser.firstName,
      lastName: registrationData.validUser.lastName,
      dob: registrationData.validUser.dob,
      phone: registrationData.validUser.phone,
      password: registrationData.validUser.password,
      country: testAddresses.netherlands.country,
      postalCode: testAddresses.netherlands.postcode,
      houseNumber: testAddresses.netherlands.houseNumber,
      state: testAddresses.netherlands.state,
      email: `customer_${timestamp}@practicesoftwaretesting.com`
    };

    await registerPage.register(newUser);

    // After successful registration, application redirects to login page
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 15000 });

    // Verify user can immediately log in with the newly created account
    const loginPage = new LoginPage(page);
    await loginPage.login(newUser.email, newUser.password);
    await expect(page).toHaveURL(/.*account/);
    await expect(loginPage.navMenu).toContainText(`${newUser.firstName} ${newUser.lastName}`);
  });

  test('REG-02: Empty form submission triggers required field validation errors', { tag: '@smoke' }, async () => {
    await registerPage.registerButton.click();

    // Verify all required field error alerts appear
    await expect(registerPage.firstNameError).toBeVisible();
    await expect(registerPage.firstNameError).toContainText('First name is required');

    await expect(registerPage.lastNameError).toBeVisible();
    await expect(registerPage.lastNameError).toContainText('Last name is required');

    await expect(registerPage.dobError).toBeVisible();
    await expect(registerPage.dobError).toContainText(/Date of Birth is required|Please enter a valid date/);

    await expect(registerPage.countryError).toBeVisible();
    await expect(registerPage.countryError).toContainText('Country is required');

    await expect(registerPage.postalCodeError).toBeVisible();
    await expect(registerPage.postalCodeError).toContainText('Postcode is required');

    await expect(registerPage.houseNumberError).toBeVisible();
    await expect(registerPage.houseNumberError).toContainText('House number is required');

    await expect(registerPage.cityError).toBeVisible();
    await expect(registerPage.cityError).toContainText('City is required');

    await expect(registerPage.stateError).toBeVisible();
    await expect(registerPage.stateError).toContainText('State is required');

    await expect(registerPage.phoneError).toBeVisible();
    await expect(registerPage.phoneError).toContainText('Phone is required');

    await expect(registerPage.emailError).toBeVisible();
    await expect(registerPage.emailError).toContainText('Email is required');

    await expect(registerPage.passwordError).toBeVisible();
    await expect(registerPage.passwordError).toContainText('Password is required');
  });

  test('REG-03: Registering with an already existing email shows duplicate error', { tag: '@smoke' }, async ({ page }) => {
    await registerPage.register({
      firstName: registrationData.existingUser.firstName,
      lastName: registrationData.existingUser.lastName,
      dob: registrationData.existingUser.dob,
      phone: registrationData.existingUser.phone,
      password: registrationData.existingUser.password,
      country: testAddresses.netherlands.country,
      postalCode: testAddresses.netherlands.postcode,
      houseNumber: testAddresses.netherlands.houseNumber,
      state: testAddresses.netherlands.state,
      email: defaultUsers.customer1.email
    });

    await expect(registerPage.registerError).toBeVisible();
    await expect(registerPage.registerError).toContainText('A customer with this email address already exists');
    await expect(page).toHaveURL(/.*auth\/register/);
  });

  test('REG-04: Invalid email format triggers email validation error', { tag: '@regression' }, async ({ page }) => {
    await registerPage.emailInput.fill(invalidCredentials.invalidEmailFormat);
    await registerPage.registerButton.click();

    await expect(registerPage.emailError).toBeVisible();
    await expect(registerPage.emailError).toContainText('Email format is invalid');
    await expect(page).toHaveURL(/.*auth\/register/);
  });

  test('REG-05: Customer under 18 years old is rejected by age validation', { tag: '@regression' }, async ({ page }) => {
    const timestamp = Date.now();
    await registerPage.register({
      firstName: registrationData.underageUser.firstName,
      lastName: registrationData.underageUser.lastName,
      dob: registrationData.underageUser.dob,
      phone: registrationData.underageUser.phone,
      password: registrationData.underageUser.password,
      country: testAddresses.netherlands.country,
      postalCode: testAddresses.netherlands.postcode,
      houseNumber: testAddresses.netherlands.houseNumber,
      state: testAddresses.netherlands.state,
      email: `underage_${timestamp}@example.com`
    });

    await expect(registerPage.registerError).toBeVisible();
    await expect(registerPage.registerError).toContainText('Customer must be 18 years old.');
    await expect(page).toHaveURL(/.*auth\/register/);
  });

  test('REG-06: Invalid date format in Date of Birth triggers format error', { tag: '@regression' }, async ({ page }) => {
    await registerPage.dobInput.fill(registrationData.invalidDateFormat);
    await registerPage.registerButton.click();

    await expect(registerPage.dobError).toBeVisible();
    await expect(registerPage.dobError).toContainText('Please enter a valid date in YYYY-MM-DD format.');
    await expect(page).toHaveURL(/.*auth\/register/);
  });

  test('REG-07: Password shorter than 6 characters triggers password length error', { tag: '@regression' }, async ({ page }) => {
    await registerPage.passwordInput.fill(registrationData.shortPassword);
    await registerPage.registerButton.click();

    await expect(registerPage.passwordError).toBeVisible();
    await expect(registerPage.passwordError).toContainText('Password must be minimal 6 characters long.');
    await expect(page).toHaveURL(/.*auth\/register/);
  });

  test('REG-08: Address autofill populates street, city, and state on valid postal code and house number', { tag: '@regression' }, async () => {
    await registerPage.countrySelect.selectOption(testAddresses.netherlands.countryCode);
    await registerPage.postalCodeInput.fill(testAddresses.netherlands.postcode);
    await registerPage.houseNumberInput.fill(testAddresses.netherlands.houseNumber);

    // Verify address fields are automatically populated by the application
    await expect(registerPage.streetInput).not.toHaveValue('');
    await expect(registerPage.cityInput).not.toHaveValue('');
    await expect(registerPage.stateInput).not.toHaveValue('');
  });

  test('REG-09: Navigation link from Login page redirects to Register page', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/.*auth\/register/);
    await expect(registerPage.pageHeading).toBeVisible();
  });

  test('REG-10: Compromised password is rejected with a data leak warning', { tag: '@regression' }, async ({ page }) => {
    const timestamp = Date.now();
    await registerPage.register({
      firstName: registrationData.compromisedPasswordUser.firstName,
      lastName: registrationData.compromisedPasswordUser.lastName,
      dob: registrationData.compromisedPasswordUser.dob,
      phone: registrationData.compromisedPasswordUser.phone,
      password: registrationData.compromisedPasswordUser.password,
      country: testAddresses.netherlands.country,
      postalCode: testAddresses.netherlands.postcode,
      houseNumber: testAddresses.netherlands.houseNumber,
      state: testAddresses.netherlands.state,
      email: `customer_${timestamp}@example.com`
    });

    await expect(registerPage.registerError).toBeVisible();
    await expect(registerPage.registerError).toContainText('The given password has appeared in a data leak');
    await expect(page).toHaveURL(/.*auth\/register/);
  });
});
