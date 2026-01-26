## **Project Overview**

This repository contains Playwright UI tests written in TypeScript for the Polaris demo application. Tests are organised under the `tests/` folder and use a Page Object Model for most of the tests to improve maintainability.

**How to Install and Run Tests**
- **Install dependencies:**

```bash
npm install
npx playwright  install
```

- **Run all tests:**

```bash
npx playwright  test
```

-  **Run a single spec file:**
```bash
npx playwright  test  tests/path/to/file.spec.ts
```

-  **Open HTML report after a run:**
```bash
npx playwright show-report
```

**Framework and Libraries Used**
-  **Playwright Test (TypeScript):** test runner and automation library.

-  **Node.js / npm:** package and runtime.
- Tests use a Page Object Model pattern located under `tests/pageObjects/` and helper utilities under `helpers/`.

 
**Known Issues or Limitations**
- Focus is on UI and integration testing using Page Object Model; optional API testing was not implemented due to time spent on the UI work.

- Some tests use explicit `waitForTimeout` calls which may cause flakiness; these are left intentionally as simple stabilisers and should be replaced with smarter waits in future iterations.

- Locale/formatting assumptions are minimal — price normalisation uses a naive regex (digits and dots) and may not handle all locales correctly.  

**Switching Between Main and Buggy Site URLs**

The base URL used by tests is set in `playwright.config.ts`. You can switch between the main and the buggy site by editing or toggling the appropriate `baseURL` line.

- Current default: `baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com'`

- Buggy site (commented): `// baseURL: process.env.BASE_URL || 'https://with-bugs.practicesoftwaretesting.com/'`


To use the buggy site, either set the `BASE_URL` env var or uncomment the buggy `baseURL` line and comment out the main' baseURL' line. Example using environment variable (recommended):
 

```bash
BASE_URL=https://with-bugs.practicesoftwaretesting.com npx playwright  test
```

Or edit `playwright.config.ts` and toggle the lines to make the desired `baseURL` active.