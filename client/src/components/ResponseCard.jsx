function ResponseCard({ status, message, fileName, totalRows, inserted, failed }) {
const isSuccess = status === "success";

return (
<section className="summary-section">
<div className="summary-card">
<div className="summary-header">
<span className="summary-icon">📊</span>
<h2 className="summary-title">Upload Summary</h2>
</div>

    <p className={isSuccess ? "summary-status success-text" : "summary-status error-text"}>
      {message}
    </p>

    <div className="summary-rows">
      <div className="summary-row">
        <span className="summary-label">
          <span className="summary-label-icon">📁</span>
          File name
        </span>
        <span className="summary-colon">:</span>
        <span className="summary-value summary-file">{fileName}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">
          <span className="summary-label-icon">📄</span>
          Total rows
        </span>
        <span className="summary-colon">:</span>
        <span className="summary-value">{totalRows}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">
          <span className="summary-label-icon success-dot">✔</span>
          Inserted
        </span>
        <span className="summary-colon">:</span>
        <span className="summary-value">{inserted}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">
          <span className="summary-label-icon warn-dot">!</span>
          Failed
        </span>
        <span className="summary-colon">:</span>
        <span className="summary-value">{failed}</span>
      </div>
    </div>
  </div>
</section>


);
}

export default ResponseCard;