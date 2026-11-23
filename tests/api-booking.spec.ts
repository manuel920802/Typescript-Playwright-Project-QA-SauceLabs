import { test, expect } from "../fixtures/pom.fixture";
import { sampleBooking } from "../test-data/booking.data";
import {
  CreateBookingResponse,
  BookingPayload,
  BookingIdItem,
} from "../test-data/booking.types";

test.describe("Restful-Booker REST API CRUD Suite", () => {
  test("Full API Lifecycle: Create (POST), Retrieve (GET), Update (PUT), and Delete (DELETE) a booking", async ({
    bookingApi,
  }) => {
    // 1. POST: Create a new booking
    const createResponse = await bookingApi.createBooking(sampleBooking);
    expect(createResponse.status()).toBe(200);

    const createdBody: CreateBookingResponse = await createResponse.json();
    const bookingId = createdBody.bookingid;
    expect(bookingId).toBeGreaterThan(0);
    expect(createdBody.booking.firstname).toBe(sampleBooking.firstname);

    // 2. GET: Verify the booking persists in the backend
    const getResponse = await bookingApi.getBooking(bookingId);
    expect(getResponse.status()).toBe(200);
    const fetchedBooking: BookingPayload = await getResponse.json();
    expect(fetchedBooking).toEqual(sampleBooking);

    // 3. AUTH + PUT: Generate token and update booking price
    const token = await bookingApi.createAuthToken();
    const updatedPayload: BookingPayload = {
      ...sampleBooking,
      totalprice: 400,
    };

    const updateResponse = await bookingApi.updateBooking(
      bookingId,
      updatedPayload,
      token,
    );
    expect(updateResponse.status()).toBe(200);
    const updatedBody: BookingPayload = await updateResponse.json();
    expect(updatedBody.totalprice).toBe(400);

    // 4. DELETE: Clean up test data and verify 404 on subsequent GET
    const deleteResponse = await bookingApi.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    const verifyDeletedResponse = await bookingApi.getBooking(bookingId);
    expect(verifyDeletedResponse.status()).toBe(404);
  });

  test("Retrieve all bookings and filter by name and check-in/check-out dates", async ({
    bookingApi,
  }) => {
    // 1. Setup: Create a uniquely named booking so our filter assertion is 100% deterministic
    const uniqueFirstName = `Manuel_${Date.now()}`;
    const uniqueBooking: BookingPayload = {
      ...sampleBooking,
      firstname: uniqueFirstName,
      bookingdates: {
        checkin: "2026-12-10",
        checkout: "2026-12-15",
      },
    };

    const createResponse = await bookingApi.createBooking(uniqueBooking);
    expect(createResponse.status()).toBe(200);
    const { bookingid: createdId }: CreateBookingResponse =
      await createResponse.json();

    // 2. Act & Assert: Get all bookings without filters
    const allBookingsResponse = await bookingApi.getAllBookings();
    expect(allBookingsResponse.status()).toBe(200);

    const allBookings: BookingIdItem[] = await allBookingsResponse.json();
    expect(Array.isArray(allBookings)).toBeTruthy();
    expect(allBookings.length).toBeGreaterThan(0);

    // 3. Act & Assert: Filter by firstname, lastname, checkin, and checkout
    const filteredResponse = await bookingApi.getAllBookings({
      firstname: uniqueFirstName,
      lastname: uniqueBooking.lastname,
    });
    expect(filteredResponse.status()).toBe(200);

    const filteredBookings: BookingIdItem[] = await filteredResponse.json();
    const returnedIds = filteredBookings.map((item) => item.bookingid);
    expect(returnedIds).toContain(createdId);

    // 4. Teardown: Clean up the test booking
    const token = await bookingApi.createAuthToken();
    const deleteResponse = await bookingApi.deleteBooking(createdId, token);
    expect(deleteResponse.status()).toBe(201);
  });
});
