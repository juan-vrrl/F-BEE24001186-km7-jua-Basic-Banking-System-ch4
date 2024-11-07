import AppError from "../utils/AppError.js";

// Error handler middleware
const errorHandler = (err, req, res, next) => { 
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default errorHandler;
