interface Props {
    selectedDate: string;
    onDateChange: (date: string) => void;
    onBookClick: () => void;
}

export default function PageHeader({
    selectedDate,
    onDateChange,
    onBookClick,
}: Props) {
    return (
        <section className="page-heading">
            <div>
                <p className="eyebrow">MEETING SPACE MANAGEMENT</p>
                <h1>Room overview</h1>
                <p className="subheading">
                    Find the right space and keep your team's day running smoothly.
                </p>
            </div>
            <div className="heading-actions">
                <label className="date-control">
                    <span>Viewing date</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                </label>
                <button className="primary-button" onClick={onBookClick}>
                    + Book a room
                </button>
            </div>
        </section>
    );
}