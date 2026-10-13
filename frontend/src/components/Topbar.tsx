export default function Topbar() {
    return (
        <header className="topbar">
            <div className="breadcrumb">
                Workspace <span>/</span> Room overview
            </div>
            <div className="topbar-right">
                <span className="status-dot" />
                All systems operational
                <div className="avatar">DR</div>
            </div>
        </header>
    );
}