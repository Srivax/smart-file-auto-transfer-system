import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { handleFileUpload } from "../controllers/uploadController.js";

const router = express.Router();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute uploads directory: server/uploads
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure directory exists at startup
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage using absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Allow only .xlsx
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const fileFilter = (req, file, cb) => {
  if (file.mimetype === XLSX_MIME) return cb(null, true);
  cb(new Error("Only .xlsx files are allowed"));
};

// 2 MB file limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Optional guard for wrong content-type to give clearer 400
const ensureMultipart = (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (!ct.includes("multipart/form-data")) {
    return res.status(400).json({ success: false, message: "Use multipart/form-data with field 'file'" });
  }
  next();
};

// POST /api/upload
router.post("/", ensureMultipart, upload.single("file"), handleFileUpload);

export default router;
