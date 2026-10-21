# Practice Software Testing - Toolshop Automation

Automated test suite for [Practice Software Testing](https://practicesoftwaretesting.com/) built with Playwright and TypeScript. 

The test scenarios are based on the 18-step Testing Guide found directly on the site, covering functional paths, boundary values, equivalence partitions, and error handling.

## Tech Stack
- **Framework:** Playwright Test
- **Language:** TypeScript
- **Browser:** Chromium

## Project Structure
```text
├── helpers/             # Shared test helpers (e.g., auth login/logout)
├── pages/               # Page Object Model classes
│   ├── forgot-password.page.ts # Forgot password page elements and actions
│   ├── login.page.ts    # Login page elements and actions
│   ├── profile.page.ts  # Customer profile and password management elements and actions
│   └── register.page.ts # Register page elements and actions
├── test-data/           # Static test data and boundary values
│   ├── addresses.ts     # Test addresses (NL, London, Washington)
│   └── users.ts         # User profiles, invalid credentials, and registration templates
├── tests/               # Test specs mapped to each guide step
│   ├── 02-register.spec.ts # Step 2: Register test scenarios
│   ├── 03-login.spec.ts # Step 3: Login test scenarios
│   ├── 04-forgot-password.spec.ts # Step 4: Forgot Password test scenarios
│   └── 05-profile.spec.ts # Step 5: Customer Profile test scenarios
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

Run tests with interactive UI mode:
```bash
npm run test:ui
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

## Continuous Integration
Tests run automatically on push/PR via GitHub Actions on `ubuntu-latest`. The workflow runs Google Chrome inside a virtual display (`xvfb`) for complete browser parity and Cloudflare compatibility.

## Current Implementation Status
- [x] **Step 2: Register** (`tests/02-register.spec.ts`) - Valid registration & immediate login verification, mandatory field validation alerts, duplicate email check, invalid email format, age boundary validation (< 18 rejection), invalid date format, password minimum length check, address autofill, login-to-register navigation, and compromised password detection.
- [x] **Step 3: Login** (`tests/03-login.spec.ts`) - Valid logins, invalid credentials, required field validations, logout session handling, uppercase email, trimmed whitespace, SQL injection resilience, and protected route redirect.
- [x] **Step 4: Forgot Password** (`tests/04-forgot-password.spec.ts`) - Password reset with registered email, immediate authentication with reset password (`welcome02`), invalidation of previous password, unknown email error handling, required field validation on empty email, invalid email format validation, and navigation from login page.
- [x] **Step 5: Customer Profile** (`tests/05-profile.spec.ts`) - Profile information updates (first/last name, phone, address fields), reload persistence, phone format validation error handling, city length boundary validation (40 character acceptance vs 41 character rejection), same-password rejection, automatic session logout on password change, and immediate authentication with new password.
- [ ] **Step 6: Customer Favorites** (Next)