import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/priceHelper';

export class ShopPage extends BasePage {
  readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.products = page.locator('li.product');
  }

  // Finds the product card by its exact title
  getProduct(name: string): Locator {
    return this.products.filter({
      has: this.page.locator('.product-title', { hasText: new RegExp(`^${name}$`) }),
    });
  }

  async getPrice(name: string): Promise<number> {
    const priceText = await this.getProduct(name).locator('.product-price').innerText();
    return parsePrice(priceText);
  }

  // Clicks Buy the given number of times. The cart count in the menu is checked
  // after every click so a missed click is caught straight away.
  async buy(name: string, quantity: number) {
    const buyButton = this.getProduct(name).locator('a.btn', { hasText: 'Buy' });
    const startCount = await this.getCartCount();

    for (let i = 1; i <= quantity; i++) {
      await buyButton.click();
      await expect(this.cartLink).toContainText(`(${startCount + i})`);
    }
  }
}
