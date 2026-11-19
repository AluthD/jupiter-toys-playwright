import { test, expect } from '../fixtures/pageFixtures';
import { toCents, formatCents } from '../utils/priceHelper';
import { calculateItemCost, calculateTotalCost } from '../utils/costCalculator';
import products from '../test-data/products.json';

test.describe('Cart', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('Test case 3 - prices, subtotals and total are correct', async ({ homePage, shopPage, cartPage }) => {
    // Work out what the cart should show from the test data, before looking at the site.
    // All amounts are in cents.
    const expectedItemCosts: Record<string, number> = {};
    let expectedTotal = 0;

    await test.step('Calculate the expected cost of each item and the total', async () => {
      for (const product of products) {
        expectedItemCosts[product.name] = calculateItemCost(product);

        // shows the breakdown in the HTML report, e.g. "2 x $10.99 = $21.98"
        test.info().annotations.push({
          type: product.name,
          description: `${product.quantity} x ${formatCents(toCents(product.price))} = ${formatCents(expectedItemCosts[product.name])}`,
        });
      }

      expectedTotal = calculateTotalCost(products);
      test.info().annotations.push({ type: 'Expected total', description: formatCents(expectedTotal) });
    });

    // keep the price shown on the shop page so it can be compared with the cart
    const shopPrices: Record<string, number> = {};

    await test.step('Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear', async () => {
      await homePage.goToShop();

      for (const product of products) {
        shopPrices[product.name] = await shopPage.getPrice(product.name);
        await shopPage.buy(product.name, product.quantity);
      }

      const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
      expect(await shopPage.getCartCount()).toBe(totalQuantity);
    });

    await test.step('Go to the cart page', async () => {
      await shopPage.goToCart();
    });

    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(products.length);

    for (const product of products) {
      await test.step(`Check price and subtotal for ${product.name}`, async () => {
        const item = cartItems.find((i) => i.name === product.name);
        expect(item, `${product.name} should be in the cart`).toBeDefined();

        // expect.soft lets the test carry on so all wrong values get reported together
        expect.soft(item!.price, 'price in cart').toBe(product.price);
        expect.soft(item!.price, 'price matches the shop page').toBe(shopPrices[product.name]);
        expect.soft(item!.quantity, 'quantity').toBe(product.quantity);
        expect
          .soft(toCents(item!.subtotal), `subtotal should be ${formatCents(expectedItemCosts[product.name])}`)
          .toBe(expectedItemCosts[product.name]);
      });
    }

    const cartTotal = toCents(await cartPage.getTotal());

    await test.step('Check cart total = sum of subtotals shown in the cart', async () => {
      const sumOfSubtotals = cartItems.reduce((sum, item) => sum + toCents(item.subtotal), 0);
      expect.soft(cartTotal, `total should equal the subtotals added up (${formatCents(sumOfSubtotals)})`).toBe(
        sumOfSubtotals,
      );
    });

    await test.step('Check cart total = calculated total cost', async () => {
      expect.soft(cartTotal, `total should be ${formatCents(expectedTotal)}`).toBe(expectedTotal);
    });
  });
});
