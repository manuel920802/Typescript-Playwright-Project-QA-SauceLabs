import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { validUser, negativeLoginCases } from "../test-data/login.data";

test.describe("SauceDemo Authentication Suite", () => {
  let loginPage: LoginPage;

  //Hook: Runs before every single test to eliminate setup duplication
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo("https://www.saucedemo.com/");
    await loginPage.verifyPageLoaded();
  });

  test("Successful login with valid standard user credentials", async ({
    page,
  }) => {
    await loginPage.login(validUser.username, validUser.password);
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  // Dynamically generates 4 separate tests from our typed dataset!
  for (const testCase of negativeLoginCases) {
    test(`Negative Login - ${testCase.scenario}`, async () => {
      await loginPage.login(testCase.username, testCase.password);

      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toContain(testCase.expectedError);
    });
  }

  test("User can dismiss the error message banner", async () => {
    await loginPage.login("", "");
    expect(await loginPage.getErrorMessageText()).toContain(
      "Username is required",
    );

    await loginPage.dismissErrorMessage();
    await loginPage.verifyErrorHidden();
  });
});
