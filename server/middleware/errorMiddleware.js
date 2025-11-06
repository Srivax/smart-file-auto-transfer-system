// ===============================
// Error & Not Found Middleware
// ===============================

export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found – ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Basic classification for logging or analytics
  const isValidation = err.message?.toLowerCase().includes("invalid") || err.message?.includes("validation");
  const isDatabase = err.message?.toLowerCase().includes("mongo");
  const isFileError = err.message?.toLowerCase().includes("file") || err.message?.includes("upload");

  // Standardized error payload
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    errorType: isValidation
      ? "ValidationError"
      : isDatabase
      ? "DatabaseError"
      : isFileError
      ? "FileError"
      : "ServerError",
    message: err.message || "Unexpected server error",
    stack: process.env.NODE_ENV === "production" ? "hidden" : err.stack
  });
};
