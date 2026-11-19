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
  readonly rows: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('table.cart-items');
    this.rows = this.cartTable.locator('tbody tr').filter({ has: page.locator('td') });
    this.total = page.locator('strong.total');
  }

  // Reads every row of the cart table. The column positions are taken from the
  // table headings, so the code still works if the columns are reordered.
  async getCartItems(): Promise<CartItem[]> {
    await expect(this.cartTable).toBeVisible();

    const headings = await this.cartTable.locator('thead th').allInnerTexts();
    const columns = headings.map((h) => h.trim().toLowerCase());
    const itemCol = columns.indexOf('item');
    const priceCol = columns.indexOf('price');
    const quantityCol = columns.indexOf('quantity');
    const subtotalCol = columns.indexOf('subtotal');

    const items: CartItem[] = [];

    for (const row of await this.rows.all()) {
      const cells = row.locator('td');

      // quantity is an input box in the table
      const quantityCell = cells.nth(quantityCol);
      const hasInput = (await quantityCell.locator('input').count()) > 0;
      const quantity = hasInput
        ? await quantityCell.locator('input').inputValue()
        : await quantityCell.innerText();

      items.push({
        name: (await cells.nth(itemCol).innerText()).replace(/\s+/g, ' ').trim(),
        price: parsePrice(await cells.nth(priceCol).innerText()),
        quantity: Number(quantity),
        subtotal: parsePrice(await cells.nth(subtotalCol).innerText()),
      });
    }

    return items;
  }

  async getTotal(): Promise<number> {
    return parsePrice(await this.total.innerText());
  }
}
