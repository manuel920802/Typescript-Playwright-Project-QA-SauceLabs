import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { BookingApiClient } from "../api/BookingApiClient";
import { sampleBooking } from "../test-data/booking.data";
import {
  BookingPayload,
  CreateBookingResponse,
} from "../test-data/booking.types";

// Define a clean type for our auto-managed test data
export type ManagedBooking = {
  bookingId: number;
  payload: BookingPayload;
};

type FrameworkFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  bookingApi: BookingApiClient;
  createdBooking: ManagedBooking; // 👈 New auto-teardown fixture
};

// 2. Extend Playwright's base test with automatic Page Object instantiation
export const test = base.extend<FrameworkFixtures>({
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

  // 👇 Fixture Composition: Uses 'bookingApi' to create and auto-delete test data
  createdBooking: async ({ bookingApi }, use) => {
    // 1. SETUP: Create a unique booking before the test starts
    const uniquePayload: BookingPayload = {
      ...sampleBooking,
      firstname: `Manuel_${Date.now()}`,
    };

    const createResponse = await bookingApi.createBooking(uniquePayload);
    expect(createResponse.status()).toBe(200);
    const body: CreateBookingResponse = await createResponse.json();
    const bookingId = body.bookingid;

    // 2. HANDOFF: Pass the created booking to the test block
    await use({ bookingId, payload: uniquePayload });

    // 3. TEARDOWN: Always runs after the test finishes (even if an assertion failed!)
    const token = await bookingApi.createAuthToken();
    const deleteResponse = await bookingApi.deleteBooking(bookingId, token);

    // Note: 201 = deleted successfully, 405 = already deleted by the test itself
    expect([201, 405]).toContain(deleteResponse.status());
  },
});

// 3. Re-export 'expect' so test files import both 'test' and 'expect' from one place
export { expect } from "@playwright/test";
