import type { FormEvent } from "react";
import type { Room } from "../types";

export interface BookingFormData {
    room_id: string;
    title: string;
    email: string;
    attendees: string;
    start: string;
    end: string;
}

interface Props {
    rooms: Room[];
    form: BookingFormData;
    setForm: (form: BookingFormData) => void;
    busy: boolean;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function BookingForm({
    rooms, form, setForm, busy, onClose, onSubmit,
}: Props) {
    const update = (key: keyof BookingFormData, value: string) =>
        setForm({ ...form, [key]: value });

    return (
        <section className="panel booking-panel">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">NEW RESERVATION</p>
                    <h2>Book a meeting room</h2>
                </div>
                <button className="icon-button" onClick={onClose}>×</button>
            </div>

            <form className="booking-form" onSubmit={onSubmit}>
                <label className="field full-field">
                    Meeting title
                    <input required maxLength={120} value={form.title}
                        placeholder="Product planning session"
                        onChange={e => update("title", e.target.value)} />
                </label>

                <label className="field">
                    Meeting room
                    <select required value={form.room_id}
                        onChange={e => update("room_id", e.target.value)}>
                        <option value="">Select a room</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.name} · {room.capacity} people · Floor {room.floor}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="field">
                    Organizer email
                    <input required type="email" value={form.email}
                        placeholder="you@company.com"
                        onChange={e => update("email", e.target.value)} />
                </label>

                <label className="field">
                    Attendees
                    <input required type="number" min="1" value={form.attendees}
                        onChange={e => update("attendees", e.target.value)} />
                </label>

                <label className="field">
                    Start time
                    <input required type="time" value={form.start}
                        onChange={e => update("start", e.target.value)} />
                </label>

                <label className="field">
                    End time
                    <input required type="time" value={form.end}
                        onChange={e => update("end", e.target.value)} />
                </label>

                <div className="form-actions">
                    <button type="button" className="secondary-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="primary-button" disabled={busy}>
                        {busy ? "Booking..." : "Confirm booking"}
                    </button>
                </div>
            </form>
        </section>
    );
}