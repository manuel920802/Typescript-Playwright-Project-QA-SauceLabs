import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { validUser } from "../test-data/login.data";
import { products } from "../test-data/inventory.data";

test.describe("SauceDemo Product Catalog & Sorting Suite", () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.navigateTo("https://www.saucedemo.com/");
    await loginPage.login(validUser.username, validUser.password);
    await inventoryPage.verifyPageLoaded();
  });

  test("Adding and removing products updates the header cart badge", async () => {
    await inventoryPage.header.verifyCartCount(0);

    //Add two products
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.header.verifyCartCount(2);

    // Clicking the button again removes the item from cart
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.header.verifyCartCount(1);
  });

  test("Sorting products by Price (low to high) orders items ascending", async () => {
    await inventoryPage.sortBy("lohi");

    const actualPrices = await inventoryPage.getAllProductPrices();
    const expectedSortedPrices = [...actualPrices].sort((a, b) => a - b);

    expect(actualPrices).toEqual(expectedSortedPrices);
  });

  test("Sorting products by Name (Z to A) orders items descending", async () => {
    await inventoryPage.sortBy("za");

    const actualNames = await inventoryPage.getAllProductNames();
    const expectedSortedNames = [...actualNames].sort().reverse();

    expect(actualNames).toEqual(expectedSortedNames);
  });

  test("User can log out via the shared header menu", async ({ page }) => {
    await inventoryPage.header.logout();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });
});
