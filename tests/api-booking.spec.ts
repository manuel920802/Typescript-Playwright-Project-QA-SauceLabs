import { test, expect } from "../fixtures/pom.fixture";
import { sampleBooking } from "../test-data/booking.data";
import {
  CreateBookingResponse,
  BookingPayload,
  BookingIdItem,
} from "../test-data/booking.types";

test.describe("Restful-Booker REST API CRUD Suite", { tag: "@api" }, () => {
  test(
    "Retrieve and update an existing booking via GET and PUT",
    { tag: "@smoke" },
    async ({ bookingApi, createdBooking }) => {
      const { bookingId, payload } = createdBooking;

      // 1. GET: Verify the auto-created booking exists
      const getResponse = await bookingApi.getBooking(bookingId);
      expect(getResponse.status()).toBe(200);
      const fetchedBooking: BookingPayload = await getResponse.json();
      expect(fetchedBooking).toEqual(payload);

      // 2. PUT: Update booking price using auth token
      const token = await bookingApi.createAuthToken();
      const updatedPayload: BookingPayload = { ...payload, totalprice: 450 };

      const updatedResponse = await bookingApi.updateBooking(
        bookingId,
        updatedPayload,
        token,
      );
      expect(updatedResponse.status()).toBe(200);
      const updatedBody: BookingPayload = await updatedResponse.json();
      expect(updatedBody.totalprice).toBe(450);

      // No manual DELETE needed here — createdBooking teardown handles it automatically!
    },
  );

  test("Filter bookings by firstname and lastname", async ({
    bookingApi,
    createdBooking,
  }) => {
    const { bookingId, payload } = createdBooking;

    // Act: Filter by the unique firstname created by the fixture
    const filteredResponse = await bookingApi.getAllBookings({
      firstname: payload.firstname,
      lastname: payload.lastname,
    });
    expect(filteredResponse.status()).toBe(200);

    const filteredBookings: BookingIdItem[] = await filteredResponse.json();
    const returnedIds = filteredBookings.map((item) => item.bookingid);
    expect(returnedIds).toContain(bookingId);
  });

  test("Explicitly delete a booking and verify 404 on subsequent GET", async ({
    bookingApi,
    createdBooking,
  }) => {
    const { bookingId } = createdBooking;
    const token = await bookingApi.createAuthToken();

    const deleteResponse = await bookingApi.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    const verifyDeletedResponse = await bookingApi.getBooking(bookingId);
    expect(verifyDeletedResponse.status()).toBe(404);
  });
});
