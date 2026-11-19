# Jupiter Toys - Playwright Tests

UI tests for the Planit technical assessment, written with Playwright and TypeScript.

Site under test: http://jupiter.cloud.planittesting.com

## Test cases

| Test case | File | What it checks |
| --- | --- | --- |
| 1 | `tests/contact.spec.ts` | Submit the empty contact form, check the error messages, fill the mandatory fields and check the errors are gone |
| 2 | `tests/contact.spec.ts` | Fill the mandatory fields, submit and check the success message. Runs 5 times |
| 3 | `tests/cart.spec.ts` | Buy 2 Stuffed Frog, 5 Fluffy Bunny and 3 Valentine Bear, then check each price, each subtotal and the total in the cart |

Tests run on Chromium, Firefox and WebKit.

## Folder structure

```
pages/          page objects (BasePage, HomePage, ContactPage, ShopPage, CartPage)
fixtures/       makes the page objects available to the tests
tests/          the test files
utils/          config, test data and price helpers
test-data/      products and quantities for test case 3
.github/        GitHub Actions pipeline
```

## Setup

You need Node.js 20 or later.

```
npm install
npx playwright install
copy .env.example .env
```

(`copy` is for Windows. On Mac/Linux use `cp .env.example .env`.)

## Running the tests

```
npm test                 all tests, all browsers
npm run test:chrome      Chromium only
npm run test:headed      Chromium with the browser visible
npm run test:contact     test cases 1 and 2
npm run test:cart        test case 3
npm run report           open the HTML report from the last run
```

## Configuration

Settings are read from the `.env` file (see `.env.example`). The `.env` file is not committed to git, so
passwords or keys can go there safely. If a value is also set as an environment variable, the environment
variable is used, which is how the CI pipeline passes its settings in.

| Variable | Default | Used for |
| --- | --- | --- |
| BASE_URL | http://jupiter.cloud.planittesting.com | site to test |
| HEADLESS | true | set to false to see the browser |
| RETRIES | 0 | retries for failed tests |
| WORKERS | 2 | tests running in parallel |
| SUBMIT_TIMEOUT | 60000 | how long to wait for the contact form success message (ms) |
| CONTACT_RUNS | 5 | number of times test case 2 runs |

## Approach

- **Page Object Model.** Each page has its own class holding its locators and actions, so if the site changes
  only the page class needs updating. The menu is the same on every page, so it sits in `BasePage`.
- **Fixtures.** The page objects are added to Playwright's `test` in `fixtures/pageFixtures.ts`. Tests just ask
  for `contactPage`, `shopPage` and so on.
- **Running test case 2 five times.** A loop creates five separate tests. Each one gets a new browser and new
  contact details, and each shows in the report on its own. Retries are 0 locally so a failure can't be hidden
  by a retry.
- **Checking money.** Prices are compared in cents. Adding decimals in JavaScript can give values like
  116.89999 instead of 116.9, which would make the total check fail for the wrong reason.
- **Prices in test case 3.** Each cart price is checked against the expected price in `test-data/products.json`
  and against the price shown on the shop page. Soft assertions are used so all wrong values are reported in
  one run instead of stopping at the first one.
- **Test data.** Contact details are generated for each run (`utils/testData.ts`) so runs don't reuse the same
  data.
- **Navigation checks.** After clicking a menu link the URL is checked (`BasePage`), so if navigation fails the
  test stops there with a clear message rather than failing later on a missing element.
- **Cart count after every Buy click.** `ShopPage.buy` checks the "Cart (n)" count goes up after each click, so a
  click that didn't register is caught on the shop page instead of showing up as a wrong quantity in the cart.

## CI pipeline

`.github/workflows/playwright.yml` runs on every push and pull request to `main`, and can be started manually
from the Actions tab. Each browser runs as a separate job, and each job checks the TypeScript compiles before
running the tests. The HTML report, screenshots and traces are
uploaded as artifacts on each run.

To test a different environment, add a repository variable called `BASE_URL` under
Settings > Secrets and variables > Actions > Variables. Secrets (like passwords) are added under Secrets and
mapped in the `env:` section of the workflow.
