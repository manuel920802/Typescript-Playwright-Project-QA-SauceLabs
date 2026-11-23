import { APIRequestContext, APIResponse } from "@playwright/test";
import {
  BookingPayload,
  BookingSearchParams,
} from "../test-data/booking.types";

export class BookingApiClient {
  private readonly baseUrl = "https://restful-booker.herokuapp.com";
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // Authenticates and returns a session token for protected endpoints (PUT/DELETE)
  async createAuthToken(
    username: string = "admin",
    password: string = "password123",
  ): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
      data: { username, password },
    });
    const body = await response.json();
    return body.token;
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/booking`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: payload,
    });
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/booking/${bookingId}`, {
      headers: { Accept: "application/json" },
    });
  }

  async getAllBookings(params?: BookingSearchParams): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/booking`, {
      params: params as Record<string, string>,
    });
  }

  async updateBooking(
    bookingId: number,
    payload: BookingPayload,
    token: string,
  ): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}/booking/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
      data: payload,
    });
  }

  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/booking/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    });
  }
}
