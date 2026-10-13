import type { Booking, Room } from "../types";
import { formatTime, getAmenities } from "../utils/bookingUtils";

interface Props {
    room: Room;
    bookings: Booking[];
    index: number;
    onCancel: (id: number) => void;
    onBook: (room: Room) => void;
}

export default function RoomCard({
    room, bookings, index, onCancel, onBook,
}: Props) {
    const colors = ["lavender", "mint", "peach", "sky", "rose"];
    const amenities = getAmenities(room.amenities);

    return (
        <article className="room-card">
            <div className={`room-card-art ${colors[index % colors.length]}`}>
                <div className="room-art-symbol">▦</div>
                <span className="floor-pill">FLOOR {room.floor}</span>
            </div>

            <div className="room-card-body">
                <div className="room-title-row">
                    <h3>{room.name}</h3>
                    <span className={`availability-pill ${bookings.length ? "has-bookings" : "is-free"}`}>
                        <i />
                        {bookings.length ? `${bookings.length} booking(s)` : "No bookings"}
                    </span>
                </div>

                <div className="room-meta">
                    <span>♙ {room.capacity} people</span>
                    <span>⌂ Floor {room.floor}</span>
                </div>

                <div className="amenities">
                    {amenities.length
                        ? amenities.map(item => <span key={item}>{item}</span>)
                        : <span>Standard meeting setup</span>}
                </div>

                <div className="schedule-block">
                    <div className="schedule-title">
                        <strong>Today's schedule</strong>
                        <span>{bookings.length} event(s)</span>
                    </div>

                    {!bookings.length ? (
                        <div className="no-bookings">
                            <span className="free-dot" /> No reservations scheduled
                        </div>
                    ) : (
                        <div className="booking-list">
                            {bookings.map(booking => (
                                <div className="booking-row" key={booking.id}>
                                    <div className="booking-time">
                                        {formatTime(booking.start)} – {formatTime(booking.end)}
                                    </div>
                                    <div className="booking-details">
                                        <strong>{booking.title}</strong>
                                        <span>{booking.attendees} attendees · {booking.email}</span>
                                    </div>
                                    <button className="cancel-link" type="button"
                                        onClick={() => onCancel(booking.id)}>
                                        Cancel
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="button" className="room-book-button"
                    onClick={() => onBook(room)}>
                    + Book this room
                </button>
            </div>
        </article>
    );
}