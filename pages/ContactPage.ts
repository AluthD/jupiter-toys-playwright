import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ContactDetails } from '../utils/testData';
import { config } from '../utils/config';

export class ContactPage extends BasePage {
  readonly forenameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  readonly welcomeMessage: Locator;
  readonly formWarning: Locator;
  readonly forenameError: Locator;
  readonly emailError: Locator;
  readonly invalidEmailError: Locator;
  readonly messageError: Locator;

  readonly sendingPopup: Locator;

  constructor(page: Page) {
    super(page);
    // The form fields have proper <label> tags, so they can be found by label text
    this.forenameInput = page.getByLabel('Forename');
    this.emailInput = page.getByLabel('Email');
    this.messageInput = page.getByLabel('Message');
    // Submit looks like a button but is a link on this site
    this.submitButton = page.getByRole('link', { name: 'Submit' });

    // Banner at the top of the form. It says "tell it how it is" normally,
    // and changes to a warning when the form has errors.
    this.welcomeMessage = page.getByText('tell it how it is');
    this.formWarning = page.getByText("we won't get it unless you complete the form correctly");

    this.forenameError = page.getByText('Forename is required');
    this.emailError = page.getByText('Email is required');
    this.invalidEmailError = page.getByText('Please enter a valid email');
    this.messageError = page.getByText('Message is required');

    this.sendingPopup = page.getByText('Sending Feedback');
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async fillMandatoryFields(contact: ContactDetails) {
    await this.forenameInput.fill(contact.forename);
    await this.emailInput.fill(contact.email);
    await this.messageInput.fill(contact.message);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async checkErrorsShown() {
    await expect(this.formWarning).toBeVisible();
    await expect(this.forenameError).toBeVisible();
    await expect(this.emailError).toBeVisible();
    await expect(this.messageError).toBeVisible();
  }

  async checkErrorsGone() {
    await expect(this.forenameError).toBeHidden();
    await expect(this.emailError).toBeHidden();
    await expect(this.messageError).toBeHidden();
    await expect(this.formWarning).toBeHidden();
    await expect(this.welcomeMessage).toBeVisible();
  }

  async checkInvalidEmailErrorShown() {
    await expect(this.invalidEmailError).toBeVisible();
    await expect(this.formWarning).toBeVisible();
  }

  async checkInvalidEmailErrorGone() {
    await expect(this.invalidEmailError).toBeHidden();
    await expect(this.welcomeMessage).toBeVisible();
  }

  async checkSuccessMessage(forename: string) {
    // A "Sending Feedback" popup shows for a few seconds before the message appears,
    // so this needs a longer wait than the default.
    await expect(this.sendingPopup).toBeHidden({ timeout: config.submitTimeout });
    await expect(this.page.getByText(`Thanks ${forename}, we appreciate your feedback.`)).toBeVisible({
      timeout: config.submitTimeout,
    });
  }
}
