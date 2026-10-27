import { test, expect } from '@playwright/test';
import { MessagesPage } from '../pages/messages.page';
import { MessageDetailPage } from '../pages/message-detail.page';
import { LoginPage } from '../pages/login.page';
import { defaultUsers, messagesData } from '../test-data/users';
import { loginAsCustomer } from '../helpers/auth';
import { ensureCustomerHasMessages } from '../helpers/messages';

test.describe('Step 08 - Customer Messages', () => {
  let messagesPage: MessagesPage;
  let messageDetailPage: MessageDetailPage;

  test.beforeEach(async ({ page }) => {
    messagesPage = new MessagesPage(page);
    messageDetailPage = new MessageDetailPage(page);
  });

  test('MSG-01: Messages displayed in chronological order', { tag: '@smoke' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await ensureCustomerHasMessages(page, 2);
    await messagesPage.goto();

    await expect(messagesPage.pageTitle).toBeVisible();
    await expect(messagesPage.messageRows.first()).toBeVisible();

    const dates = await messagesPage.getAllMessageDates();
    expect(dates.length).toBeGreaterThanOrEqual(2);

    // Verify dates are ordered newest to oldest (descending chronological order)
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]).getTime();
      const next = new Date(dates[i + 1]).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  test('MSG-02: Open message detail and view message thread', { tag: '@smoke' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await ensureCustomerHasMessages(page, 1);
    await messagesPage.goto();

    const subject = await messagesPage.getFirstMessageSubject();
    await messagesPage.openFirstMessageDetails();

    await expect(page).toHaveURL(/.*messages\/.*/);
    await expect(messageDetailPage.backLink).toBeVisible();
    await expect(messageDetailPage.subjectHeader).toContainText(subject);
    await expect(messageDetailPage.messageBody).not.toHaveText('');
    await expect(messageDetailPage.repliesHeading).toBeVisible();
    await expect(messageDetailPage.messageInput).toBeVisible();
    await expect(messageDetailPage.replySubmitButton).toBeVisible();
  });

  test('MSG-03: Send a valid reply to message thread', { tag: '@smoke' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await ensureCustomerHasMessages(page, 1);
    await messagesPage.goto();
    await messagesPage.openFirstMessageDetails();

    // Ensure thread content is loaded from API before submitting reply
    await expect(messageDetailPage.messageBody).not.toHaveText('');

    const uniqueReply = `Customer reply at ${Date.now()}`;
    await messageDetailPage.sendReply(uniqueReply);

    // Verify reply appears in the thread
    await expect(page.getByText(uniqueReply)).toBeVisible();

    // Verify reply textarea is cleared after successful submission
    await expect(messageDetailPage.messageInput).toHaveValue('');
  });

  test('MSG-04: Empty reply does not send and does not add a reply', { tag: '@regression' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await ensureCustomerHasMessages(page, 1);
    await messagesPage.goto();
    await messagesPage.openFirstMessageDetails();

    // Ensure thread content is loaded
    await expect(messageDetailPage.messageBody).not.toHaveText('');

    const initialRepliesCount = await messageDetailPage.replyCards.count();

    // Attempt to submit empty reply
    await messageDetailPage.sendReply(messagesData.emptyReply);

    // Verify no new reply card was appended
    await expect(messageDetailPage.replyCards).toHaveCount(initialRepliesCount);
  });

  test('MSG-05: Back link navigates from detail back to messages list', { tag: '@regression' }, async ({ page }) => {
    await loginAsCustomer(page, defaultUsers.customer1);
    await ensureCustomerHasMessages(page, 1);
    await messagesPage.goto();
    await messagesPage.openFirstMessageDetails();

    // Ensure thread content is loaded
    await expect(messageDetailPage.messageBody).not.toHaveText('');

    await messageDetailPage.backLink.click();
    await expect(page).toHaveURL(/.*account\/messages$/);
    await expect(messagesPage.pageTitle).toBeVisible();
  });

  test('MSG-06: Messages page when logged out redirects to login', { tag: '@regression' }, async ({ page }) => {
    await messagesPage.goto();
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('MSG-07: Another customer message by URL does not display thread data', { tag: '@regression' }, async ({ page }) => {
    // Collect first message URL of customer1
    await loginAsCustomer(page, defaultUsers.customer1);
    await ensureCustomerHasMessages(page, 1);
    await messagesPage.goto();
    const customer1MessageHref = await messagesPage.getFirstMessageDetailsHref();

    // Log out customer1
    const loginPage = new LoginPage(page);
    await loginPage.logout();

    // Log in as customer2
    await loginPage.goto();
    await loginPage.login(defaultUsers.customer2.email, defaultUsers.customer2.password);
    await expect(page).toHaveURL(/.*account/);

    // Attempt to access customer1's message URL directly
    await messageDetailPage.goto(customer1MessageHref);

    // Verify unauthorized message thread has empty body and no replies
    await expect(messageDetailPage.messageBody).toHaveText('');
    await expect(messageDetailPage.replyCards).toHaveCount(0);
  });
});
