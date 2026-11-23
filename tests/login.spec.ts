import { test, expect } from "../fixtures/pom.fixture"; // 👈 Imported from our fixture!
import { validUser, negativeLoginCases } from "../test-data/login.data";

test.describe("SauceDemo Authentication Suite", () => {
  // No more 'let loginPage: LoginPage' or 'new LoginPage(page)'!
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo("/");
    await loginPage.verifyPageLoaded();
  });

  test("Successful login with valid standard user credentials", async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(validUser.username, validUser.password);
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  // Dynamically generates 4 separate tests from our typed dataset!
  for (const testCase of negativeLoginCases) {
    test(`Negative Login - ${testCase.scenario}`, async ({ loginPage }) => {
      await loginPage.login(testCase.username, testCase.password);

      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toContain(testCase.expectedError);
    });
  }

  test("User can dismiss the error message banner", async ({ loginPage }) => {
    await loginPage.login("", "");
    expect(await loginPage.getErrorMessageText()).toContain(
      "Username is required",
    );

    await loginPage.dismissErrorMessage();
    await loginPage.verifyErrorHidden();
  });
});
