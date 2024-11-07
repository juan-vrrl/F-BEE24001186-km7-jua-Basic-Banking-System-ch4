import morgan from "morgan";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swaggerOptions.js";

export default (app) => {
  // Trust proxy headers for reverse proxy handling (e.g., Nginx)
  app.set("trust proxy", true);

  // Logging
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined")); // Logs requests in 'combined' format
  } else {
    app.use(morgan("dev")); // Logs requests in 'dev' format for development
  }

  // JSON Parsing
  app.use(express.json());

  // Swagger API Docs
  app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
