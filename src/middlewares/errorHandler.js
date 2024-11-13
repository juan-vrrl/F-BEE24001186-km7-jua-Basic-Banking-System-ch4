import AppError from "../utils/AppError.js";

// Error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => { 
  if (err instanceof AppError) {
    // Handle custom application errors
    return res.status(err.statusCode).json({
      error: err.message,
    });
  } else {
    // Handle general errors
    return res.status(500).json({
      error: "Internal Server Error",
      sentry_id: res.sentry || null, 
    });
  }
};

export default errorHandler;
