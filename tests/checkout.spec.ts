import { test, expect } from "../fixtures/pom.fixture";
import { validUser } from "../test-data/login.data";
import { products } from "../test-data/inventory.data";
import { validCustomer } from "../test-data/checkout.data";

test.describe("SauceDemo End-to-End Checkout Suite", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigateTo("/inventory.html");
    await inventoryPage.verifyPageLoaded();
  });

  test("Complete E2E purchase flow with two items and price calculation check", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Add items from catalog
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.boltTShirt);
    await inventoryPage.header.verifyCartCount(2);

    // 2. Review items in Cart
    await inventoryPage.header.openCart();
    await cartPage.verifyPageLoaded();

    const cartItems = await cartPage.getProductCartNames();
    expect(cartItems).toEqual([products.backpack, products.boltTShirt]);

    // 3. Fill shipping info & verify tax/total math
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyPageLoaded();
    await checkoutPage.fillShippingInformation(validCustomer);
    await checkoutPage.verifyOrderMath();

    // 4. Complete order
    await checkoutPage.finishOrder();
    await checkoutPage.verifyOrderCompleted();
  });

  test("Checkout validation fails when required shipping fields are empty", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInformation({
      firstName: "",
      lastName: "",
      postalCode: "",
    });

    const errorText = await checkoutPage.getErrorMessage();
    expect(errorText).toContain("Error: First Name is required");
  });
});
