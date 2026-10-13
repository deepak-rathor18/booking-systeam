import type { Booking, BookingPayload, Room } from "./types";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let body: unknown = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const data = body as {
      message?: string;
      error?: string;
    } | null;

    throw new Error(
      data?.message || data?.error || `Request failed (${response.status})`,
    );
  }

  return body as T;
}

export const api = {
  rooms: () => request<Room[]>("/rooms"),

  bookings: (date: string) =>
    request<Booking[]>(`/bookings?date=${encodeURIComponent(date)}`),

  createBooking: (payload: BookingPayload) =>
    request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cancelBooking: (id: number) =>
    request<{ message?: string }>(`/bookings/${id}/cancel`, {
      method: "PATCH",
    }),

  availability: (start: string, end: string, capacity: number) =>
    request<Room[]>(
      `/availability?start=${encodeURIComponent(start)}` +
        `&end=${encodeURIComponent(end)}` +
        `&capacity=${capacity}`,
    ),
};
