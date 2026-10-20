import { Page, Locator } from '@playwright/test';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  street?: string;
  city?: string;
  state?: string;
  phone: string;
  email: string;
  password: string;
}

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  // Validation / Error Locators
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly dobError: Locator;
  readonly countryError: Locator;
  readonly postalCodeError: Locator;
  readonly houseNumberError: Locator;
  readonly streetError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly phoneError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly registerError: Locator;

  // Registration header
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inputs (using testId attributes for reliability and speed)
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.streetInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerButton = page.getByRole('button', { name: 'Register' });

    // Error messages
    this.firstNameError = page.getByTestId('first-name-error');
    this.lastNameError = page.getByTestId('last-name-error');
    this.dobError = page.getByTestId('dob-error');
    this.countryError = page.getByTestId('country-error');
    this.postalCodeError = page.getByTestId('postal_code-error');
    this.houseNumberError = page.getByTestId('house_number-error');
    this.streetError = page.getByTestId('street-error');
    this.cityError = page.getByTestId('city-error');
    this.stateError = page.getByTestId('state-error');
    this.phoneError = page.getByTestId('phone-error');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.registerError = page.getByTestId('register-error');

    this.pageHeading = page.getByRole('heading', { name: 'Customer registration' });
  }

  async goto() {
    await this.page.goto('/auth/register', { waitUntil: 'domcontentloaded' });
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async register(data: RegisterFormData) {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.dob) await this.dobInput.fill(data.dob);

    if (data.country) {
      const countryMap: Record<string, string> = {
        'The Netherlands': 'NL',
        'Netherlands': 'NL',
        'United Kingdom': 'GB',
        'United States': 'US'
      };
      const countryValue = countryMap[data.country] || data.country;
      await this.countrySelect.selectOption(countryValue);
    }
    if (data.postalCode) await this.postalCodeInput.fill(data.postalCode);
    if (data.houseNumber) await this.houseNumberInput.fill(data.houseNumber);

    // Playwright best practice: Event-Driven Synchronization over Hard Sleeps.
    // Entering postcode and house number triggers an asynchronous background API call
    // (/postcode-lookup) in Angular. Playwright's built-in actionability checks only verify
    // that the Register button is clickable in the DOM—they cannot detect in-flight HTTP requests.
    // If the button is clicked while the API response arrives, Angular re-renders the address
    // fields and swallows the form submission. Rather than using an anti-pattern like a hard
    // sleep (waitForTimeout), we synchronize deterministically with the network promise.
    if (data.postalCode && data.houseNumber) {
      await this.page.waitForResponse(
        res => res.url().includes('postcode-lookup'),
        { timeout: 3000 }
      ).catch(() => {});
    }

    // Fill address fields only if not already populated by autofill
    if (data.street) {
      const currentStreet = await this.streetInput.inputValue();
      if (!currentStreet) {
        await this.streetInput.fill(data.street);
      }
    }
    if (data.city) {
      const currentCity = await this.cityInput.inputValue();
      if (!currentCity) {
        await this.cityInput.fill(data.city);
      }
    }
    if (data.state) {
      const currentState = await this.stateInput.inputValue();
      if (!currentState) {
        await this.stateInput.fill(data.state);
      }
    }

    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.password) await this.passwordInput.fill(data.password);

    await this.registerButton.click();
  }
}
