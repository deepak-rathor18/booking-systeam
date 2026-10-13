import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { api } from "./api";
import type { Booking, Room } from "./types";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PageHeader from "./components/PageHeader";
import AlertMessage from "./components/AlertMessage";
import StatsGrid from "./components/StatsGrid";
import BookingForm from "./components/BookingForm";
import AvailabilitySearch from "./components/AvailabilitySearch";
import RoomCard from "./components/RoomCard";
import AppFooter from "./components/AppFooter";

import { today, toLocalDateTime } from "./utils/bookingUtils";
import type { BookingFormData } from "./components/BookingForm";

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [availability, setAvailability] = useState<Room[] | null>(null);

  const [minCapacity, setMinCapacity] = useState("1");
  const [availabilityStart, setAvailabilityStart] = useState("10:00");
  const [availabilityEnd, setAvailabilityEnd] = useState("11:00");

  const [form, setForm] = useState<BookingFormData>({
    room_id: "", title: "", email: "", attendees: "2",
    start: "10:00", end: "11:00",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [roomData, bookingData] = await Promise.all([
        api.rooms(),
        api.bookings(selectedDate),
      ]);
      setRooms(Array.isArray(roomData) ? roomData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const bookingsByRoom = useMemo(() => {
    const map = new Map<number, Booking[]>();

    bookings.filter(b => b.status !== "cancelled").forEach(booking => {
      map.set(booking.room_id, [
        ...(map.get(booking.room_id) || []), booking,
      ]);
    });

    map.forEach(items => items.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    ));

    return map;
  }, [bookings]);

  const confirmedCount = bookings.filter(
    b => b.status !== "cancelled"
  ).length;

  const availableRoomCount = rooms.filter(
    room => !(bookingsByRoom.get(room.id)?.length)
  ).length;

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const start = toLocalDateTime(selectedDate, form.start);
    const end = toLocalDateTime(selectedDate, form.end);

    if (new Date(end) <= new Date(start)) {
      setError("End time must be later than start time.");
      return;
    }

    const room = rooms.find(r => r.id === Number(form.room_id));

    if (!room) {
      setError("Please select a meeting room.");
      return;
    }

    const attendees = Number(form.attendees);

    if (attendees < 1 || attendees > room.capacity) {
      setError(`This room supports 1 to ${room.capacity} attendees.`);
      return;
    }

    setBusy(true);

    try {
      await api.createBooking({
        room_id: room.id,
        title: form.title.trim(),
        email: form.email.trim(),
        attendees,
        start,
        end,
      });

      setNotice("Booking created successfully.");
      setShowForm(false);
      setForm(current => ({ ...current, title: "", email: "" }));
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create booking.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel(id: number) {
    if (!window.confirm("Cancel this booking?")) return;

    setError("");
    setNotice("");

    try {
      await api.cancelBooking(id);
      setNotice("Booking cancelled.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel booking.");
    }
  }

  async function searchAvailability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setAvailability(null);

    if (availabilityEnd <= availabilityStart) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      const result = await api.availability(
        toLocalDateTime(selectedDate, availabilityStart),
        toLocalDateTime(selectedDate, availabilityEnd),
        Number(minCapacity)
      );
      setAvailability(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Availability search failed.");
    }
  }

  function chooseRoom(room: Room) {
    setForm(current => ({
      ...current,
      room_id: String(room.id),
      start: availabilityStart,
      end: availabilityEnd,
    }));
    setAvailability(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bookRoom(room: Room) {
    setForm(current => ({ ...current, room_id: String(room.id) }));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <PageHeader
          selectedDate={selectedDate}
          onDateChange={date => {
            setSelectedDate(date);
            setAvailability(null);
          }}
          onBookClick={() => setShowForm(value => !value)}
        />

        {error && (
          <AlertMessage type="error" message={error} onClose={() => setError("")} />
        )}
        {notice && (
          <AlertMessage type="success" message={notice} onClose={() => setNotice("")} />
        )}

        <StatsGrid
          totalRooms={rooms.length}
          totalBookings={confirmedCount}
          availableRooms={availableRoomCount}
        />

        {showForm && (
          <BookingForm
            rooms={rooms}
            form={form}
            setForm={setForm}
            busy={busy}
            onClose={() => setShowForm(false)}
            onSubmit={handleBookingSubmit}
          />
        )}

        <AvailabilitySearch
          start={availabilityStart}
          end={availabilityEnd}
          capacity={minCapacity}
          results={availability}
          onStartChange={setAvailabilityStart}
          onEndChange={setAvailabilityEnd}
          onCapacityChange={setMinCapacity}
          onSearch={searchAvailability}
          onChoose={chooseRoom}
        />

        <section className="rooms-section">
          <div className="section-heading">
            <div>
              <h2>All meeting rooms</h2>
              <p>
                Room schedules for{" "}
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                  [], { weekday: "long", month: "long", day: "numeric" }
                )}.
              </p>
            </div>
            <span className="rooms-count">{rooms.length} SPACES</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" /> Loading rooms and bookings…
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▦</div>
              <h3>No rooms found</h3>
              <p>Rooms will appear when the API returns room data.</p>
            </div>
          ) : (
            <div className="room-grid">
              {rooms.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  index={index}
                  bookings={bookingsByRoom.get(room.id) || []}
                  onCancel={id => void handleCancel(id)}
                  onBook={bookRoom}
                />
              ))}
            </div>
          )}
        </section>

        <AppFooter />
      </main>
    </div>
  );
}