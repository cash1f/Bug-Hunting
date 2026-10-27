import { Page, Locator } from '@playwright/test';

export class MessageDetailPage {
  readonly page: Page;
  readonly backLink: Locator;
  readonly subjectHeader: Locator;
  readonly messageBody: Locator;
  readonly messageFooter: Locator;
  readonly repliesHeading: Locator;
  readonly replyCards: Locator;
  readonly messageInput: Locator;
  readonly replySubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backLink = page.getByTestId('back');
    this.subjectHeader = page.locator('.card.bg-secondary .card-header');
    this.messageBody = page.locator('.card.bg-secondary .card-body p.card-text');
    this.messageFooter = page.locator('.card.bg-secondary .card-footer small');
    this.repliesHeading = page.getByRole('heading', { name: 'Replies' });
    this.replyCards = page.locator('.col-sm-12 > .card.bg-light:not(:has([data-test="message"]))');
    this.messageInput = page.getByTestId('message');
    this.replySubmitButton = page.getByTestId('reply-submit');
  }

  async goto(messageUrl: string) {
    await this.page.goto(messageUrl);
  }

  async sendReply(message: string) {
    if (message !== '') {
      await this.messageInput.fill(message);
    } else {
      await this.messageInput.clear();
    }
    await this.replySubmitButton.click();
  }
}
