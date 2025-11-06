import XLSX from "xlsx";
import fs from "fs";
import Student from "../models/Student.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateRows } from "../utils/validateRows.js";

export const handleFileUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const filePath = req.file.path;

  try {
    // 1) Read Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      res.status(400);
      throw new Error("No sheet found in uploaded file");
    }
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    // 2) Header check
    const required = ["Name", "Roll", "Subject", "Marks"];
    const hasHeaders = rows.length > 0 && required.every((c) => Object.keys(rows[0]).includes(c));
    if (!hasHeaders) {
      res.status(400);
      throw new Error(`Missing columns. Required: ${required.join(", ")}`);
    }

    // 3) Row-level validation
    const { valid, invalid } = validateRows(rows);

    if (!valid.length) {
      res.status(400);
      throw new Error("No valid records found in uploaded file");
    }

    // 4) Insert valid documents
    await Student.insertMany(valid, { ordered: false });

    // 5) Response summary
    res.status(200).json({
      message: "Upload completed",
      sheet: sheetName,
      totalRows: rows.length,
      inserted: valid.length,
      invalid: invalid.length,
      invalidSample: invalid.slice(0, 3)
    });
  } finally {
    // Always cleanup temp file
    try { fs.unlinkSync(filePath); } catch { /* ignore */ }
  }
});
