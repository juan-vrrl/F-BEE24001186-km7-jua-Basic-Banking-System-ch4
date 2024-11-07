import AppError from "../utils/AppError.js";

// Error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => { 
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default errorHandler;
