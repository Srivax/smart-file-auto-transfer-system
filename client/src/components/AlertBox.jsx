export default function AlertBox({ type, title, message, onClose }) {
  const baseClass = "alert-box";
  const typeClass =
    type === "error"
      ? "alert-error"
      : type === "warning"
      ? "alert-warning"
      : "alert-success";

  return (
    <div className={baseClass + " " + typeClass}>
      <div className="alert-content">
        <div className="alert-icon">
          {type === "error" && "⛔"}
          {type === "warning" && "⚠️"}
          {type === "success" && "✅"}
        </div>
        <div className="alert-text">
          <p className="alert-title">{title}</p>
          <p className="alert-message">{message}</p>
        </div>
      </div>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
}
