import { test, expect } from "../fixtures/pom.fixture";
import { validUser } from "../test-data/login.data";
import { products } from "../test-data/inventory.data";

test.describe("SauceDemo Product Catalog & Sorting Suite", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigateTo("/inventory.html");
    await inventoryPage.verifyPageLoaded();
  });

  test("Adding and removing products updates the header cart badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.header.verifyCartCount(0);

    //Add two products
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.header.verifyCartCount(2);

    // Clicking the button again removes the item from cart
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.header.verifyCartCount(1);
  });

  test("Sorting products by Price (low to high) orders items ascending", async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy("lohi");

    const actualPrices = await inventoryPage.getAllProductPrices();
    const expectedSortedPrices = [...actualPrices].sort((a, b) => a - b);

    expect(actualPrices).toEqual(expectedSortedPrices);
  });

  test("Sorting products by Name (Z to A) orders items descending", async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy("za");

    const actualNames = await inventoryPage.getAllProductNames();
    const expectedSortedNames = [...actualNames].sort().reverse();

    expect(actualNames).toEqual(expectedSortedNames);
  });

  test("User can log out via the shared header menu", async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.header.logout();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });
});
