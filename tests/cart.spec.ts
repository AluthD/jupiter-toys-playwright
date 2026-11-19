import { test, expect } from '../fixtures/pageFixtures';
import { toCents } from '../utils/priceHelper';
import products from '../test-data/products.json';

test.describe('Cart', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('Test case 3 - prices, subtotals and total are correct', async ({ homePage, shopPage, cartPage }) => {
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
        expect.soft(toCents(item!.subtotal), 'subtotal').toBe(toCents(item!.price * item!.quantity));
      });
    }

    await test.step('Check total = sum of subtotals', async () => {
      const total = await cartPage.getTotal();
      const sumOfSubtotals = cartItems.reduce((sum, item) => sum + toCents(item.subtotal), 0);

      expect(toCents(total)).toBe(sumOfSubtotals);
    });
  });
});
