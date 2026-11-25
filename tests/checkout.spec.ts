import { test, expect } from "../fixtures/pom.fixture";
import { products } from "../test-data/inventory.data";
import { validCustomer } from "../test-data/checkout.data";

test.describe("SauceDemo End-to-End Checkout Suite", { tag: "@e2e" }, () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigateTo("/inventory.html");
    await inventoryPage.verifyPageLoaded();
  });

  test(
    "Complete E2E purchase flow with two items and price calculation check",
    { tag: "@smoke" },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      await test.step("1. Add two products to shopping cart", async () => {
        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.boltTShirt);
        await inventoryPage.header.verifyCartCount(2);
      });

      await test.step("2. Review cart items and proceed to checkout", async () => {
        await inventoryPage.header.openCart();
        await cartPage.verifyPageLoaded();
        const cartItems = await cartPage.getProductCartNames();
        expect(cartItems).toEqual([products.backpack, products.boltTShirt]);
        await cartPage.proceedToCheckout();
      });

      await test.step("3. Enter shipping details and validate subtotal + tax math", async () => {
        await checkoutPage.verifyPageLoaded();
        await checkoutPage.fillShippingInformation(validCustomer);
        await checkoutPage.verifyOrderMath();
      });

      await test.step("4. Finalize order and confirm completion banner", async () => {
        await checkoutPage.finishOrder();
        await checkoutPage.verifyOrderCompleted();
      });
    },
  );

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
