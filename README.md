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
│   └── login.page.ts    # Login page elements and actions
├── test-data/           # Static test data and boundary values
│   ├── addresses.ts     # Test addresses (NL, London, Washington)
│   └── users.ts         # Default accounts (admin and customer roles)
├── tests/               # Test specs mapped to each guide step
│   └── 03-login.spec.ts # Step 3: Login test scenarios
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

## Current Implementation Status
- [x] **Step 3: Login** (`tests/03-login.spec.ts`) - Valid logins, invalid credentials, required field validations, logout session handling, uppercase email, trimmed whitespace, SQL injection resilience, and protected route redirect.
- [ ] **Step 2: Register** (Next)