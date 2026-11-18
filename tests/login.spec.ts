import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("SauceDemo Authentication Suite", () => {
  test("Successful login with valid standard user credentials", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo("https://www.saucedemo.com/");
    await loginPage.verifyPageLoaded();
    await loginPage.login("standard_user", "secret_sauce");

    //Verify navigation to inventory page
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  test("Locked out user sees appropiate error message", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo("https://www.saucedemo.com/");
    await loginPage.login("locked_out_user", "secret_sauce");

    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });
});
