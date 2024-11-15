import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export default (app) => {
  app.get("/", (req, res) => {
    res.render("index", {
      title: "Home Page",
      docs_url: `http://${process.env.APP_URL}/api/v1/api-docs`,
    });
  });

  app.get("/reset-password", (req, res) => {
    try {
      const token = req.query.token;
      jwt.verify(token, process.env.JWT_SECRET);
      res.render("resetPassword", { token });
    } catch (error) {
      console.error("Error rendering reset password page:", error);
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "Token expired. Please request a new password reset link.",
          400
        );
      } else if (error.name === "JsonWebTokenError") {
        throw new AppError("Invalid token.", 400);
      }
      throw error;
    }
  });
};
