interface Props {
    totalRooms: number;
    totalBookings: number;
    availableRooms: number;
}

export default function StatsGrid({
    totalRooms,
    totalBookings,
    availableRooms,
}: Props) {
    const stats = [
        ["Total meeting rooms", totalRooms, "Across all floors", "▦", "purple"],
        ["Bookings today", totalBookings, "Confirmed reservations", "◷", "blue"],
        ["Rooms without bookings", availableRooms, "Based on selected day", "✓", "green"],
    ];

    return (
        <section className="stats-grid">
            {stats.map(([label, value, description, icon, color]) => (
                <div className="stat-card" key={label}>
                    <div className="stat-top">
                        <span>{label}</span>
                        <span className={`stat-icon ${color}`}>{icon}</span>
                    </div>
                    <strong>{value}</strong>
                    <p>{description}</p>
                </div>
            ))}
        </section>
    );
}