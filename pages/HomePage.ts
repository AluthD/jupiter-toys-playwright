import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    // baseURL comes from playwright.config.ts, so '/' is the home page
    await this.page.goto('/');
  }
}
