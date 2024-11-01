export const checkMultipart = (req, res, next) => {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }
    next();
  };