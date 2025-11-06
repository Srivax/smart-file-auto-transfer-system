import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import Student from "../models/Student.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const handleFileUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const filePath = req.file.path;

  // read excel
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

  // basic column checks
  const required = ["Name", "Roll", "Subject", "Marks"];
  const missingCols = required.filter((col) => !Object.keys(rows[0] || {}).includes(col));
  if (missingCols.length) {
    fs.unlinkSync(filePath);
    res.status(400);
    throw new Error(`Missing columns: ${missingCols.join(", ")}`);
  }

  // prepare docs
  const docs = [];
  const errors = [];
  for (const [idx, r] of rows.entries()) {
    const name = String(r.Name).trim();
    const roll = String(r.Roll).trim();
    const subject = String(r.Subject).trim();
    const marks = Number(r.Marks);

    if (!name || !roll || !subject || Number.isNaN(marks)) {
      errors.push({ row: idx + 2, issue: "Empty or invalid fields" }); // +2 for header + 1-based row
      continue;
    }
    if (marks < 0 || marks > 100) {
      errors.push({ row: idx + 2, issue: "Marks out of range 0-100" });
      continue;
    }
    docs.push({ name, roll, subject, marks });
  }

  // bulk insert valid docs
  if (docs.length) {
    await Student.insertMany(docs, { ordered: false });
  }

  // cleanup
  fs.unlinkSync(filePath);

  return res.status(200).json({
    message: "File processed",
    totalRows: rows.length,
    inserted: docs.length,
    failed: errors.length,
    sample: rows.slice(0, 2),
    errors
  });
});

