import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';

type Pages = {
  homePage: HomePage;
  contactPage: ContactPage;
  shopPage: ShopPage;
  cartPage: CartPage;
};

// Extending Playwright's test so the page objects are created for each test
// and can be used straight from the test arguments.
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
