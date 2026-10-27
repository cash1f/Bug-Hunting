[![Playwright Tests](https://github.com/cash1f/Bug-Hunting/actions/workflows/playwright.yml/badge.svg)](https://github.com/cash1f/Bug-Hunting/actions/workflows/playwright.yml)

# Practice Software Testing - Toolshop Automation

Automated test suite for [Practice Software Testing](https://practicesoftwaretesting.com/) built with Playwright and TypeScript. 

The test scenarios are based on the 18-step Testing Guide found directly on the site, covering functional paths, boundary values, equivalence partitions, and error handling.

## Tech Stack
- **Framework:** Playwright Test
- **Language:** TypeScript
- **Browser:** Chromium

## Project Structure
```text
├── helpers/             # Shared test helpers (e.g., auth login/logout, customer creation, messages)
│   ├── auth.ts          # Authentication and customer registration helpers
│   └── messages.ts      # Contact messages and inquiry helpers
├── pages/               # Page Object Model classes
│   ├── favorites.page.ts # Customer favorites page elements and actions
│   ├── forgot-password.page.ts # Forgot password page elements and actions
│   ├── invoice-detail.page.ts # Invoice detail and PDF download elements and actions
│   ├── invoices.page.ts # Customer invoices list elements and actions
│   ├── login.page.ts    # Login page elements and actions
│   ├── message-detail.page.ts # Message thread details and reply form elements and actions
│   ├── messages.page.ts # Customer messages list elements and actions
│   ├── product-detail.page.ts # Product detail page elements and actions
│   ├── profile.page.ts  # Customer profile and password management elements and actions
│   └── register.page.ts # Register page elements and actions
├── test-data/           # Static test data and boundary values
│   ├── addresses.ts     # Test addresses (NL, London, Washington)
│   └── users.ts         # User profiles, invalid credentials, and registration templates
├── tests/               # Test specs mapped to each guide step
│   ├── 02-register.spec.ts # Step 2: Register test scenarios
│   ├── 03-login.spec.ts # Step 3: Login test scenarios
│   ├── 04-forgot-password.spec.ts # Step 4: Forgot Password test scenarios
│   ├── 05-profile.spec.ts # Step 5: Customer Profile test scenarios
│   ├── 06-favorites.spec.ts # Step 6: Customer Favorites test scenarios
│   ├── 07-invoices.spec.ts # Step 7: Customer Invoices test scenarios
│   └── 08-messages.spec.ts # Step 8: Customer Messages test scenarios
├── playwright.config.ts # Playwright configuration (baseURL, testId, reporter)
├── package.json         # Scripts and dependencies
└── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Running tests
Run the full test suite:
```bash
npm test
```

Run tests with visible browser (headed mode):
```bash
npm run test:headed
```

Slow down headed execution to watch actions live:
```bash
# Slow down every action by 500ms
SLOWMO=500 npm run test:headed

# Slow down a specific test file by 1000ms (1 second per action)
SLOWMO=1000 npx playwright test tests/03-login.spec.ts --headed
```

Debug tests step-by-step with the Playwright Inspector:
```bash
npx playwright test tests/03-login.spec.ts --debug
```

Run only smoke tests:
```bash
npm run test:smoke
```

Run only regression tests:
```bash
npm run test:regression
```

Run a specific test file:
```bash
npx playwright test tests/03-login.spec.ts
```

View the HTML test report:
```bash
npm run report
```

### 3. Listing and Counting Tests (Dry Run)
Testers can preview and count tests matching specific tags without executing them using `--list`:

List all `@smoke` tests and get total count:
```bash
npx playwright test --grep @smoke --list
```

List all `@regression` tests and get total count:
```bash
npx playwright test --grep @regression --list
```

List and count all tests across the repository:
```bash
npx playwright test --list
```

## Continuous Integration
Tests run automatically on push/PR via GitHub Actions on `ubuntu-latest`. The workflow runs Google Chrome inside a virtual display (`xvfb`) for complete browser parity and Cloudflare compatibility.

## Current Implementation Status
- [x] **Step 2: Register** (`tests/02-register.spec.ts`) - Valid registration & immediate login verification, mandatory field validation alerts, duplicate email check, invalid email format, age boundary validation (< 18 rejection), invalid date format, password minimum length check, address autofill, login-to-register navigation, and compromised password detection.
- [x] **Step 3: Login** (`tests/03-login.spec.ts`) - Valid logins, invalid credentials, required field validations, logout session handling, uppercase email, trimmed whitespace, SQL injection resilience, and protected route redirect.
- [x] **Step 4: Forgot Password** (`tests/04-forgot-password.spec.ts`) - Password reset with registered email, immediate authentication with reset password (`welcome02`), invalidation of previous password, unknown email error handling, required field validation on empty email, invalid email format validation, and navigation from login page.
- [x] **Step 5: Customer Profile** (`tests/05-profile.spec.ts`) - Profile information updates (first/last name, phone, address fields), reload persistence, phone format validation error handling, city length boundary validation (40 character acceptance vs 41 character rejection), same-password rejection, automatic session logout on password change, and immediate authentication with new password.
- [x] **Step 6: Customer Favorites** (`tests/06-favorites.spec.ts`) - Adding favorites from product detail page, listing card favorite capability check, adding multiple favorites and deleting a specific item with list verification, duplicate favorite prevention error toast, favorite persistence across logout and re-login, logged-out favorite rejection with unauthorized toast, and unavailable product URL handling.
- [x] **Step 7: Customer Invoices** (`tests/07-invoices.spec.ts`) - Customer invoices list viewing, opening invoice details, detail values matching list values (invoice number, date, total), PDF download with file name, size, and `%PDF-` header validation, logged-out access redirect to login, and unauthorized cross-customer invoice access prevention (404 / no data shown).
- [x] **Step 8: Customer Messages** (`tests/08-messages.spec.ts`) - Customer messages list viewing, chronological date ordering verification (newest first), viewing message thread details and history, sending valid reply with thread display verification and textarea reset, empty reply rejection without sending, navigation back to messages list via Back link, logged-out access redirect to login, and unauthorized cross-customer message thread access protection.
- [ ] **Step 9: Locked Account** (Next)
