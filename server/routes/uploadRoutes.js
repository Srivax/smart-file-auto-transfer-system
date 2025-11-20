import express from "express";
import multer from "multer";
import fs from "fs/promises"; // CORRECTION: Use promises API for async operations
import path from "path";
import { fileURLToPath } from "url";

import { handleFileUpload } from "../controllers/uploadController.js";

const router = express.Router();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants - Better maintainability and clarity
const UPLOAD_DIR_NAME = "uploads";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB - CORRECTION: Named constant for clarity
const XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const ALLOWED_FILE_EXTENSION = ".xlsx"; // CORRECTION: Validate extension as defense in depth

// Absolute uploads directory: server/uploads
const uploadDir = path.join(__dirname, "..", UPLOAD_DIR_NAME);

/**
 * Ensures the upload directory exists, creating it if necessary.
 * Uses async/await to avoid blocking the event loop.
 * CORRECTION: Changed from sync to async for better performance
 */
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir); // Check if directory exists
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// Initialize upload directory asynchronously at module load
// CORRECTION: Async initialization prevents blocking event loop
ensureUploadDir().catch((err) => {
  console.error("❌ Failed to create upload directory:", err.message);
  // In production, you might want to exit here if upload directory is critical
});

/**
 * Sanitizes filename to prevent path traversal and special character issues.
 * CORRECTION: Security enhancement - prevents directory traversal attacks
 * @param {string} originalname - Original filename from upload
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (originalname) => {
  // Remove path separators and prevent directory traversal
  const basename = path.basename(originalname);
  
  // Remove or replace potentially dangerous characters
  // Keep only alphanumeric, dots, hyphens, underscores, and spaces
  const sanitized = basename.replace(/[^a-zA-Z0-9._\s-]/g, "_");
  
  // Limit filename length to prevent filesystem issues
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = path.extname(sanitized);
    const nameWithoutExt = path.basename(sanitized, ext);
    const truncated = nameWithoutExt.substring(0, maxLength - ext.length - 20); // Reserve space for timestamp
    return `${truncated}${ext}`;
  }
  
  return sanitized;
};

/**
 * Multer disk storage configuration.
 * CORRECTION: Added filename sanitization for security
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // CORRECTION: Sanitize filename before using it
    const sanitized = sanitizeFilename(file.originalname);
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${sanitized}`;
    cb(null, uniqueFilename);
  }
});

/**
 * File filter function to validate uploaded files.
 * CORRECTION: Added file extension validation in addition to MIME type (defense in depth)
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Validate MIME type
  if (file.mimetype !== XLSX_MIME_TYPE) {
    return cb(
      new Error(`Invalid file type. Only ${ALLOWED_FILE_EXTENSION} files are allowed.`),
      false
    );
  }

  // CORRECTION: Also validate file extension as defense against MIME type spoofing
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (fileExtension !== ALLOWED_FILE_EXTENSION) {
    return cb(
      new Error(`Invalid file extension. Only ${ALLOWED_FILE_EXTENSION} files are allowed.`),
      false
    );
  }

  cb(null, true);
};

/**
 * Multer upload configuration.
 * Uses disk storage with file filtering and size limits.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    // CORRECTION: Added additional limits for better security
    files: 1, // Only allow single file upload
    fields: 1 // Only allow one field (the 'file' field)
  }
});

/**
 * Middleware to ensure request uses multipart/form-data.
 * Note: This is somewhat redundant since multer handles this, but provides clearer error messages.
 * CORRECTION: Improved error response format to match errorMiddleware pattern
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const ensureMultipart = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  
  if (!contentType.includes("multipart/form-data")) {
    return res.status(400).json({
      success: false,
      status: 400,
      errorType: "ValidationError",
      message: "Content-Type must be multipart/form-data. Please use form-data with field 'file'."
    });
  }
  
  next();
};

/**
 * Error handler middleware specifically for Multer errors.
 * CORRECTION: Added explicit multer error handling for better error messages
 * @param {Error} err - Error object (could be MulterError)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleMulterError = (err, req, res, next) => {
  // Check if it's a Multer error
  if (err instanceof multer.MulterError) {
    let message = "File upload error";
    let statusCode = 400;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`;
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files. Only one file is allowed";
        break;
      case "LIMIT_FIELD_COUNT":
        message = "Too many fields";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field. Use 'file' as the field name";
        break;
      default:
        message = `Upload error: ${err.message}`;
    }

    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      errorType: "FileError",
      message
    });
  }

  // If it's not a Multer error, pass it to the next error handler
  // (could be from fileFilter or other middleware)
  next(err);
};

/**
 * POST /api/upload
 * Uploads an Excel file (.xlsx) for processing.
 * 
 * Route flow:
 * 1. ensureMultipart - Validates Content-Type header
 * 2. upload.single("file") - Handles file upload via Multer
 * 3. handleMulterError - Catches Multer-specific errors
 * 4. handleFileUpload - Processes the uploaded file (in controller)
 * 
 * CORRECTION: Added multer error handler middleware for better error handling
 */
router.post(
  "/",
  ensureMultipart,
  upload.single("file"),
  handleMulterError, // CORRECTION: Handle multer errors explicitly
  handleFileUpload
);

export default router;
