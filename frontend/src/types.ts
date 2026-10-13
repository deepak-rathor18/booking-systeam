export interface Room {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  amenities?: string | string[];
}

export interface Booking {
  id: number;
  room_id: number;
  title: string;
  email: string;
  attendees: number;
  start: string;
  end: string;
  status?: string;
}

export interface BookingPayload {
  room_id: number;
  title: string;
  email: string;
  attendees: number;
  start: string;
  end: string;
}
