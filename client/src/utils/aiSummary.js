
// src/utils/aiSummary.js
// AI-style upload summary generator used on the Upload Summary card.

/**
 * Format a few sample error messages from failed rows.
 * We expect failedRows to look like:
 *   [{ rowNumber: 5, message: "Marks should be between 0 and 100" }, ...]
 */
function buildSampleErrorText(failedRows) {
  if (!Array.isArray(failedRows) || failedRows.length === 0) {
    return "";
  }

  const sampleErrors = failedRows
    .slice(0, 2)
    .map((row) => {
      const rowNumber = typeof row.rowNumber === "number" ? row.rowNumber : row.row;
      const message = row.message || row.error || "Validation error";
      return "Row " + rowNumber + ": " + message;
    });

  if (sampleErrors.length === 0) {
    return "";
  }

  return (
    "Here are a few examples from the failed rows: " +
    sampleErrors.join("; ") +
    ". "
  );
}

/**
 * Main AI-style summary builder.
 * All numeric fields are made safe so the text never breaks even if
 * the backend returns undefined / null.
 */
export function generateUploadSummary({
  fileName,
  totalRows,
  insertedCount,
  failedCount,
  failedRows,
}) {
  const safeFileName = fileName || "the uploaded file";
  const safeTotal = Number.isFinite(totalRows) ? totalRows : 0;
  const safeInserted = Number.isFinite(insertedCount) ? insertedCount : 0;
  const safeFailed = Number.isFinite(failedCount) ? failedCount : 0;

  const hasFailures =
    safeFailed > 0 && Array.isArray(failedRows) && failedRows.length > 0;

  const typicalReasons = [
    "missing mandatory fields such as Name, Roll number, Subject, or Marks",
    "marks outside the allowed 0–100 range",
    "non-numeric or blank values in the Marks column",
    "duplicate roll numbers inside the same file",
    "extra header rows or unexpected blank rows in between data rows",
  ];

  const sampleErrorText = buildSampleErrorText(failedRows);

  let reasonsText = "";

  if (hasFailures) {
    reasonsText =
      "Some rows did not satisfy one or more validation rules. " +
      "Typical issues include " +
      typicalReasons.join(", ") +
      ". " +
      sampleErrorText +
      "Please review the Failed rows section in the UI to see the exact row numbers and columns that need correction.";
  } else {
    if (safeTotal === 0) {
      reasonsText =
        "No records were found in the uploaded file. Please confirm that the Excel sheet contains at least one data row below the header.";
    } else {
      reasonsText =
        "All rows satisfied the current validation rules. The uploaded data is ready to be used for reports, analytics, or downstream processing.";
    }
  }

  const overviewLine =
    'File "' +
    safeFileName +
    '" was processed by the Smart File AutoTransfer System.';

  const statsLine =
    "Out of " +
    safeTotal +
    " total rows, " +
    safeInserted +
    " were inserted and " +
    safeFailed +
    " failed validation.";

  const nextStepsLine =
    "You can now proceed with the next upload or move to reporting / analytics in the backend.";

  return overviewLine + " " + statsLine + " " + reasonsText + " " + nextStepsLine;
}

/**
 * Backwards-compatible wrapper.
 * App.jsx imports { buildAISummary }, so we keep this small wrapper
 * that simply calls generateUploadSummary with the same payload.
 */
export function buildAISummary(payload) {
  return generateUploadSummary(payload);
}
