import { test } from '../fixtures/pageFixtures';
import { createContact } from '../utils/testData';
import { config } from '../utils/config';

test.describe('Contact page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('Test case 1 - mandatory field errors are shown and then cleared', async ({ homePage, contactPage }) => {
    await test.step('Go to contact page from home page', async () => {
      await homePage.goToContact();
    });

    await test.step('Click submit and check the error messages', async () => {
      await contactPage.clickSubmit();
      await contactPage.checkErrorsShown();
    });

    await test.step('Fill mandatory fields and check the errors are gone', async () => {
      await contactPage.fillMandatoryFields(createContact());
      await contactPage.checkErrorsGone();
    });
  });

  // Test case 2 needs to be run 5 times. Creating a separate test for each run
  // means every run gets a fresh browser and shows up on its own in the report.
  for (let run = 1; run <= config.contactRuns; run++) {
    test(`Test case 2 - successful submission (run ${run})`, async ({ homePage, contactPage }) => {
      const contact = createContact();

      await test.step('Go to contact page from home page', async () => {
        await homePage.goToContact();
      });

      await test.step('Fill mandatory fields and submit', async () => {
        await contactPage.fillMandatoryFields(contact);
        await contactPage.clickSubmit();
      });

      await test.step('Check the success message', async () => {
        await contactPage.checkSuccessMessage(contact.forename);
      });
    });
  }
});
