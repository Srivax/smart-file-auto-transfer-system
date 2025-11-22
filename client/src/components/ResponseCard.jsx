function formatNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }
  return value.toString();
}

export default function ResponseCard({
  message,
  fileName,
  totalRows,
  inserted,
  failed
}) {
  const safeMessage = message || "Upload completed";
  const safeFileName = fileName || "Not available";
  const safeTotal = formatNumber(totalRows);
  const safeInserted = formatNumber(inserted);
  const safeFailed = formatNumber(failed);

  const isSuccess = Number(failed) === 0;

  return (
    <div>
      <div className="summary-header">
        <span className="summary-icon">{isSuccess ? "✅" : "⚠️"}</span>
        <h2 className="summary-title">Upload Summary</h2>
      </div>
      <p className={`summary-status ${isSuccess ? "success-text" : "error-text"}`}>
        {safeMessage}
      </p>
      <div className="summary-rows">
        <div className="summary-row">
          <span className="summary-label summary-file">
            <span className="summary-label-icon">📄</span>
          File name
          </span>
          <span className="summary-colon">:</span>
          <span className="summary-value summary-file">{safeFileName}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">
            <span className="summary-label-icon success-dot">●</span>
            Total rows
          </span>
          <span className="summary-colon">:</span>
          <span className="summary-value-number">{safeTotal}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">
            <span className="summary-label-icon success-dot">●</span>
            Inserted
          </span>
          <span className="summary-colon">:</span>
          <span className="summary-value-number">{safeInserted}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">
            <span className="summary-label-icon warn-dot">●</span>
            Failed
          </span>
          <span className="summary-colon">:</span>
          <span className="summary-value-number">{safeFailed}</span>
        </div>
      </div>
    </div>
  );
}
