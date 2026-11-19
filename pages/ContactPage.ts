import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ContactDetails } from '../utils/testData';
import { config } from '../utils/config';

export class ContactPage extends BasePage {
  readonly forenameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  readonly headerMessage: Locator;
  readonly forenameError: Locator;
  readonly emailError: Locator;
  readonly messageError: Locator;

  readonly sendingPopup: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.forenameInput = page.locator('#forename');
    this.emailInput = page.locator('#email');
    this.messageInput = page.locator('#message');
    this.submitButton = page.locator('a.btn-contact', { hasText: 'Submit' });

    this.headerMessage = page.locator('.alert', { hasText: 'We welcome your feedback' });
    this.forenameError = page.locator('#forename-err');
    this.emailError = page.locator('#email-err');
    this.messageError = page.locator('#message-err');

    this.sendingPopup = page.locator('.popup.modal', { hasText: 'Sending Feedback' });
    this.successMessage = page.locator('.alert-success');
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async fillMandatoryFields(contact: ContactDetails) {
    await this.forenameInput.fill(contact.forename);
    await this.emailInput.fill(contact.email);
    await this.messageInput.fill(contact.message);
  }

  async checkErrorsShown() {
    await expect(this.headerMessage).toContainText("we won't get it unless you complete the form correctly");
    await expect(this.forenameError).toHaveText('Forename is required');
    await expect(this.emailError).toHaveText('Email is required');
    await expect(this.messageError).toHaveText('Message is required');
  }

  async checkErrorsGone() {
    await expect(this.forenameError).toBeHidden();
    await expect(this.emailError).toBeHidden();
    await expect(this.messageError).toBeHidden();
    await expect(this.headerMessage).not.toContainText('complete the form correctly');
  }

  async checkSuccessMessage(forename: string) {
    // A "Sending Feedback" popup shows for a few seconds before the message appears,
    // so this needs a longer wait than the default.
    await expect(this.sendingPopup).toBeHidden({ timeout: config.submitTimeout });
    await expect(this.successMessage).toHaveText(`Thanks ${forename}, we appreciate your feedback.`, {
      timeout: config.submitTimeout,
    });
  }
}
