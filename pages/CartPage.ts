import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/priceHelper';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly itemRows: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.getByRole('table');
    // Only product rows have a quantity box (a number input, which has the
    // "spinbutton" role). This skips the heading row and the total row.
    this.itemRows = this.cartTable.getByRole('row').filter({ has: page.getByRole('spinbutton') });
    this.total = page.getByText(/^Total:/);
  }

  // Reads every product row of the cart table. The column positions are taken
  // from the table headings, so the code still works if the columns are reordered.
  async getCartItems(): Promise<CartItem[]> {
    await expect(this.cartTable).toBeVisible();

    const headings = await this.cartTable.getByRole('columnheader').allInnerTexts();
    const columns = headings.map((h) => h.trim().toLowerCase());
    const itemCol = columns.indexOf('item');
    const priceCol = columns.indexOf('price');
    const subtotalCol = columns.indexOf('subtotal');

    const items: CartItem[] = [];

    for (const row of await this.itemRows.all()) {
      const cells = row.getByRole('cell');

      items.push({
        // the item cell also has an image, so extra spaces are cleaned up
        name: (await cells.nth(itemCol).innerText()).replace(/\s+/g, ' ').trim(),
        price: parsePrice(await cells.nth(priceCol).innerText()),
        quantity: Number(await row.getByRole('spinbutton').inputValue()),
        subtotal: parsePrice(await cells.nth(subtotalCol).innerText()),
      });
    }

    return items;
  }

  async getTotal(): Promise<number> {
    return parsePrice(await this.total.innerText());
  }
}
