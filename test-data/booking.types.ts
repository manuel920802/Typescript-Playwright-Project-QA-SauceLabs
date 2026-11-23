export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreateBookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

export interface BookingSearchParams {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export interface BookingIdItem {
  bookingid: number;
}
