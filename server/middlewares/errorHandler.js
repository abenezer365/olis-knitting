import env from "../config/env.js";

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Central error translator. Controllers may throw ApiError (operational) or any
// Error; either way the client gets a clean JSON shape and details only leak in dev.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Common MySQL errors → friendly responses instead of a generic 500.
  if (err.code === "ER_DUP_ENTRY") {
    status = 409;
    message = "A record with these details already exists";
  } else if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_ROW_IS_REFERENCED_2") {
    status = 400;
    message = "Operation violates a data relationship constraint";
  }

  if (status >= 500) {
    console.error("Unhandled error:", err);
  }

  const payload = { success: false, message };
  if (err.details) payload.details = err.details;
  if (!env.isProd && status >= 500) payload.stack = err.stack;

  res.status(status).json(payload);
};
