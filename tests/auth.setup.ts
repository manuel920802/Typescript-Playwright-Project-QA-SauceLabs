import { test as setup, expect } from "../fixtures/pom.fixture";
import { validUser } from "../test-data/login.data";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup(
  "Authenticate as standard user and save session state",
  async ({ page, loginPage }) => {
    await loginPage.navigateTo("/");
    await loginPage.verifyPageLoaded();
    await loginPage.login(validUser.username, validUser.password);

    // Wait until navigation completes so cookies/localStorage are fully populated
    await expect(page).toHaveURL("/inventory.html");

    // Save cookies and localStorage to user.json
    await page.context().storageState({ path: authFile });
  },
);
