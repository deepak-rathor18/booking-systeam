interface Props {
    type: "error" | "success";
    message: string;
    onClose: () => void;
}

export default function AlertMessage({
    type,
    message,
    onClose,
}: Props) {
    return (
        <div className={`alert ${type}-alert`}>
            <span>{type === "error" ? "!" : "✓"}</span>
            <div>
                {message}
                {type === "error" && (
                    <small>Check the backend and API routes.</small>
                )}
            </div>
            <button onClick={onClose}>×</button>
        </div>
    );
}