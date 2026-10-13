export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div>
                    <strong>Roomly</strong>
                </div>
            </div>
            <div className="side-label">WORKSPACE</div>
            <div className="nav-item active"><span>▦</span> Room overview</div>
            <div className="nav-item"><span>◷</span> Daily schedule</div>
        </aside>
    );
}