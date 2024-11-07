import multer from "multer";

const storage = multer.memoryStorage();

// Multer configuration
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Check if the request is multipart/form-data
export const checkMultipart = (req, res, next) => {
  const contentType = req.headers["content-type"];
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
  }
  next();
};

