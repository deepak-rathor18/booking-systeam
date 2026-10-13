import type { FormEvent } from "react";
import type { Room } from "../types";

interface Props {
    start: string;
    end: string;
    capacity: string;
    results: Room[] | null;
    onStartChange: (value: string) => void;
    onEndChange: (value: string) => void;
    onCapacityChange: (value: string) => void;
    onSearch: (event: FormEvent<HTMLFormElement>) => void;
    onChoose: (room: Room) => void;
}

export default function AvailabilitySearch(props: Props) {
    const {
        start, end, capacity, results,
        onStartChange, onEndChange, onCapacityChange,
        onSearch, onChoose,
    } = props;

    return (
        <section className="panel availability-panel">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">SMART SEARCH</p>
                    <h2>Find an available room</h2>
                    <p className="panel-description">
                        Search by time window and minimum capacity.
                    </p>
                </div>
                <span className="search-badge">⌕</span>
            </div>

            <form className="availability-form" onSubmit={onSearch}>
                <label className="field">
                    Start time
                    <input type="time" required value={start}
                        onChange={e => onStartChange(e.target.value)} />
                </label>

                <label className="field">
                    End time
                    <input type="time" required value={end}
                        onChange={e => onEndChange(e.target.value)} />
                </label>

                <label className="field">
                    Minimum capacity
                    <select value={capacity}
                        onChange={e => onCapacityChange(e.target.value)}>
                        {[1, 2, 4, 8, 12, 20].map(n => (
                            <option key={n} value={n}>
                                {n === 1 ? "Any size" : `${n}+ people`}
                            </option>
                        ))}
                    </select>
                </label>

                <button className="dark-button">
                    Search availability <span>→</span>
                </button>
            </form>

            {results !== null && (
                <div className="availability-results">
                    <div className="results-heading">
                        <strong>{results.length} room(s) available</strong>
                        <span>{start} – {end}</span>
                    </div>

                    {results.length === 0 ? (
                        <p className="empty-inline">No matching rooms found.</p>
                    ) : (
                        <div className="available-room-list">
                            {results.map(room => (
                                <div className="available-room" key={room.id}>
                                    <div className="room-avatar">▦</div>
                                    <div className="available-room-info">
                                        <strong>{room.name}</strong>
                                        <span>{room.capacity} people · Floor {room.floor}</span>
                                    </div>
                                    <button type="button" className="small-outline-button"
                                        onClick={() => onChoose(room)}>
                                        Book this room
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}