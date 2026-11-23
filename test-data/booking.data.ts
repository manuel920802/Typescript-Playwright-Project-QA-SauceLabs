import { BookingPayload } from "./booking.types";

export const sampleBooking: BookingPayload = {
  firstname: "Manuel",
  lastname: "QA",
  totalprice: 250,
  depositpaid: true,
  bookingdates: {
    checkin: "2026-12-01",
    checkout: "2026-12-05",
  },
  additionalneeds: "Late checkout",
};
