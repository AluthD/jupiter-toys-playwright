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
    // exact: true so "Shop" doesn't also match the "Start Shopping" button
    this.homeLink = page.getByRole('link', { name: 'Home', exact: true });
    this.shopLink = page.getByRole('link', { name: 'Shop', exact: true });
    this.contactLink = page.getByRole('link', { name: 'Contact', exact: true });
    // the cart link text changes with the number of items, e.g. "Cart (3)"
    this.cartLink = page.getByRole('link', { name: /^Cart/ });
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
