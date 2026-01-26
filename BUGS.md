
# BUGS / Test Failures

## How to reproduce failures (quick commands)

  

- Open the HTML report after a run:

```bash
npx playwright  show-report
```


**Environment:**

- OS: macOS Tahoe Version 26.2

- Node: 25.0.10

- Playwright version: 1.58.0

- Base URL used: `https://practicesoftwaretesting.com`


## Existing entries

Below are failures observed from the most recent test run (31 tests, 17 passed, 14 failed). 

  
### BUG-2026-01 AddProductToCart-1

**Test file:**  `tests/addProductToCart.spec.ts`

**Test name:** "Happy path: Add correct quantity to Cart"

**Command to reproduce:**

```bash
npx playwright  test  tests/addProductToCart.spec.ts  -g  "Happy path: Add correct quantity to Cart"
```

**Observed:** The add-to-cart locator was not found / not enabled within the timeout. Error: "expect(locator).toBeEnabled() failed — element(s) not found".

**Expected:** Add-to-cart button should be visible and enabled on the product details page.

  

---

  

### BUG-2026-02 AddProductToCart-2

**Test file:**  `tests/addProductToCart.spec.ts`

**Test name:** "Happy path: Item details are correct in Cart"

**Command to reproduce:**

```bash
npx playwright  test  tests/addProductToCart.spec.ts  -g  "Happy path: Item details are correct in Cart"
```

**Observed:** Locator for `[data-test="product-name"]` resolved to multiple elements (strict-mode violation). Test attempted to read textContent from a locator that matches many product items.

**Expected:** Only the product currently opened should be read; selector should be scoped to the product detail view.

  

---

  

### BUG-2026-03 AddProductToCart-3

**Test file:**  `tests/addProductToCart.spec.ts`

**Test name:** "Product appears in cart summary with correct name, quantity and price"

**Command to reproduce:**

```bash
npx playwright  test  tests/addProductToCart.spec.ts  -g  "Product appears in cart summary with correct name, quantity and price"
```

**Observed:** Same strict-mode violation when locating the product name on the product page (locator matches many items).

**Expected:** Product page selectors should uniquely identify the opened product.
 
---

### BUG-2026-04 CategoryFilter-Refresh

**Test file:**  `tests/categoryFilterAndReset.spec.ts`

**Test name:** "should keep selected filter after page refresh"

**Command to reproduce:**

```bash
npx playwright  test  tests/categoryFilterAndReset.spec.ts  -g  "should keep selected filter after page refresh"
```

**Observed:** Expectation for checkbox to have class `/active/` failed; received class "icheck". The UI state/class doesn't match the test's expectation.

**Expected:** Checkbox should have `active` class after refresh if filter remains selected.

---

### BUG-2026-05 CategoryFilter-NavigateBack

**Test file:**  `tests/categoryFilterAndReset.spec.ts`

**Test name:** "should keep selected filter after navigating back"

**Command to reproduce:**

```bash
npx playwright  test  tests/categoryFilterAndReset.spec.ts  -g  "should keep selected filter after navigating back"
```

**Observed:** Checkbox expected to be checked but was unchecked after navigation back.

**Expected:** Filter selection should persist when navigating back.

---

### BUG-2026-06 CompleteCheckout-Proceed3

**Test file:**  `tests/completeCheckout.spec.ts`

**Test name:** "Happy Path: Full checkout flow with shipping and payment"

**Command to reproduce:**

```bash
npx playwright  test  tests/completeCheckout.spec.ts  -g  "Happy Path: Full checkout flow with shipping and payment"
```

**Observed:** Test timed out waiting for `[data-test="proceed-3"]` to become enabled/clickable. Click action retried until test timeout (30s).

**Expected:** Proceed button should become enabled after filling shipping details.

---

### BUG-2026-07 FilterProductsByCategory-Negative (POM)

**Test file:**  `tests/filterProductsByCategory.pom.spec.ts`

**Test name:** "Negative: Selecting an empty category shows \"No results\""

**Command to reproduce:**

```bash
npx playwright  test  tests/filterProductsByCategory.pom.spec.ts  -g  "Negative: Selecting an empty category shows \"No results\""
```

**Observed:** Test expected more than 1 product (to indicate presence) but received 1 item. Assertion `toBeGreaterThan(1)` failed.

**Expected:** Either zero results (show 'no results') or a deterministic number per test assumptions; test assertion appears inconsistent with app state.

---

### BUG-2026-08 FilterProductsByCategory-Negative

**Test file:**  `tests/filterProductsByCategory.spec.ts`

**Test name:** "Negative: Selecting an empty category shows \"No results\""

**Command to reproduce:**

```bash
npx playwright  test  tests/filterProductsByCategory.spec.ts  -g  "Negative: Selecting an empty category shows \"No results\""
```

**Observed:** Same as POM variant: expected >1 but got 1.

**Expected:** Test expectations should match test data; the assertion likely needs correction.

---

### BUG-2026-09 Login-PostLogout

**Test file:**  `tests/login.pom.spec.ts`

**Test name:** "Negative Path: Login persists after log out"

**Command to reproduce:**

```bash
npx playwright  test  tests/login.pom.spec.ts  -g  "Negative Path: Login persists after log out"
```

**Observed:** After signing out, the test still expected the nav menu to contain the user's name; the locator was not found. Assertion failure suggests logout did not clear UI state as expected or selector usage is incorrect.

**Expected:** User name should not be present after sign out; nav should show "Sign in".

---

### BUG-2026-10 Search-NegativeShowsResults

**Test file:**  `tests/searchForAProduct.pom.spec.ts`

**Test name:** "Negative case - Searching invalid item showing some results"

**Command to reproduce:**

```bash
npx playwright  test  tests/searchForAProduct.pom.spec.ts  -g  "Negative case - Searching invalid item showing some results"
```

**Observed:** Test expected product count > 0 but received 0. Likely test assumes an app state that differs from current dataset.

**Expected:** Some results should appear for the invalid-item negative case (test assumption); likely the assertion should be re-evaluated.

---

### BUG-2026-11 Cart-TotalNotUpdated

**Test file:**  `tests/updateOrRemoveFromCart.pom.spec.ts`

**Test name:** "Negative case: adding quantity should update the total"

**Command to reproduce:**

```bash
npx playwright  test  tests/updateOrRemoveFromCart.pom.spec.ts  -g  "Negative case: adding quantity should update the total"
```

**Observed:** Polling for cart total to increase timed out; the total remained equal to the initial value (no change observed).

**Expected:** Updating the quantity should reflect on the cart total.

---

### BUG-2026-12 ViewOrderHistory-NoOrders

**Test file:**  `tests/viewOrderHistory.pom.spec.ts`

**Test name:** "Negative: User with no orders sees a clear message"

**Command to reproduce:**

```bash
npx playwright  test  tests/viewOrderHistory.pom.spec.ts  -g  "Negative: User with no orders sees a clear message"
```

**Observed:** Invoice count for the no-orders user was 0, whereas test expected >0. The test likely asserts the wrong condition for the no-orders user.

**Expected:** The test should either assert `invoiceCount === 0` and a clear message, or use a user with orders.

---

### BUG-2026-13 ViewProductDetails-AddToCartDisabled

**Test file:**  `tests/viewProductDetails.pom.spec.ts`

**Test name:** "Negative: Add to cart button is disabled"

**Command to reproduce:**

```bash
npx playwright  test  tests/viewProductDetails.pom.spec.ts  -g  "Negative: Add to cart button is disabled"
```

**Observed:** Add-to-cart locator not found/disabled check failed — element not found.

**Expected:** For this negative path the add-to-cart button should be disabled.

---

### BUG-2026-14 ViewProductList-NextDisabledExpectation

**Test file:**  `tests/viewProductList.pom.spec.ts`

**Test name:** "Negative: Next should not be disabled on the first page"

**Command to reproduce:**

```bash
npx playwright  test  tests/viewProductList.pom.spec.ts  -g  "Negative: Next should not be disabled on the first page"
```

**Observed:** Test expected the Next button to have `disabled` class but actual class was `page-link`. Assertion should be inverted or clarified.

**Expected:** Decide whether Next should be disabled or enabled on first page; update test accordingly.
