import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { BookingApiClient } from "../api/BookingApiClient"; // 👈 Import API Client

// 1. Define the TypeScript contract for our custom fixtures
type PageObjectFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  bookingApi: BookingApiClient;
};

// 2. Extend Playwright's base test with automatic Page Object instantiation
export const test = base.extend<PageObjectFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  // 👇 Injects Playwright's APIRequestContext into our OOP API Client
  bookingApi: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },
});

// 3. Re-export 'expect' so test files import both 'test' and 'expect' from one place
export { expect } from "@playwright/test";
