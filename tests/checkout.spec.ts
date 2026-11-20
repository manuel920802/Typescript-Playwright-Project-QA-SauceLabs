import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { validUser } from "../test-data/login.data";
import { products } from "../test-data/inventory.data";
import { validCustomer } from "../test-data/checkout.data";

test.describe("SauceDemo End-to-End Checkout Suite", () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.navigateTo("https://saucedemo.com");
    await loginPage.login(validUser.username, validUser.password);
    await inventoryPage.verifyPageLoaded();
  });

  test("Complete E2E purchase flow with two items and price calculation check", async () => {
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

  test("Checkout validation fails when required shipping fields are empty", async () => {
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
