import { expect, Locator, Page } from '@playwright/test';

// Every page on the site has the same top menu, so the menu links
// live here and all the other page classes extend this one.
export class BasePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly shopLink: Locator;
  readonly contactLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('#nav-home a');
    this.shopLink = page.locator('#nav-shop a');
    this.contactLink = page.locator('#nav-contact a');
    this.cartLink = page.locator('#nav-cart a');
  }

  // After each click the URL is checked, so a test fails here with a clear
  // message if navigation didn't happen, instead of failing later on a missing element.
  async goToContact() {
    await this.contactLink.click();
    await expect(this.page).toHaveURL(/#\/contact/);
  }

  async goToShop() {
    await this.shopLink.click();
    await expect(this.page).toHaveURL(/#\/shop/);
  }

  async goToCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/#\/cart/);
  }

  // Reads the number from the "Cart (5)" link in the menu
  async getCartCount(): Promise<number> {
    const text = await this.cartLink.innerText();
    const match = text.match(/\((\d+)\)/);
    return match ? Number(match[1]) : 0;
  }
}
