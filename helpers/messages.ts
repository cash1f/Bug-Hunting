import { Page, expect } from '@playwright/test';

// Submits a contact inquiry from the Contact Form to generate customer message threads
export async function sendContactMessage(page: Page, subjectIndex = 1, messageText = '') {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  const subjectSelect = page.getByTestId('subject');
  await subjectSelect.waitFor({ state: 'visible' });
  await subjectSelect.selectOption({ index: subjectIndex });
  const text = messageText !== '' 
    ? messageText 
    : 'This is an automated customer support inquiry that is more than fifty characters long for test setup.';
  await page.getByTestId('message').fill(text);
  await page.getByTestId('contact-submit').click();
  await expect(page.locator('.alert-success')).toBeVisible();
}

// Ensures the customer account has at least the minimum required messages (e.g. after a site reset)
export async function ensureCustomerHasMessages(page: Page, minCount = 2) {
  await page.goto('/account/messages');
  const emptyNotice = page.getByText('There are no messages yet.');
  const isEmpty = await emptyNotice.isVisible().catch(() => false);
  const currentCount = isEmpty ? 0 : await page.locator('tbody tr').count();

  for (let i = currentCount; i < minCount; i++) {
    const text = `Automated customer inquiry number ${i + 1} with more than fifty characters of content for testing.`;
    await sendContactMessage(page, (i % 3) + 1, text);
  }
}
