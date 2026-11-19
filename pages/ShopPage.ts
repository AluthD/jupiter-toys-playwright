import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/priceHelper';

export class ShopPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Each product is a list item with the product name as a heading.
  // exact: true so a name like "Bear" can't match "Valentine Bear".
  getProduct(name: string): Locator {
    return this.page.getByRole('listitem').filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    });
  }

  async getPrice(name: string): Promise<number> {
    // the price is the only text in the card that looks like "$12.99"
    const priceText = await this.getProduct(name).getByText(/^\$\d+\.\d{2}$/).innerText();
    return parsePrice(priceText);
  }

  // Clicks Buy the given number of times. The cart count in the menu is checked
  // after every click so a missed click is caught straight away.
  async buy(name: string, quantity: number) {
    const buyButton = this.getProduct(name).getByRole('link', { name: 'Buy' });
    const startCount = await this.getCartCount();

    for (let i = 1; i <= quantity; i++) {
      await buyButton.click();
      await expect(this.cartLink).toContainText(`(${startCount + i})`);
    }
  }
}
