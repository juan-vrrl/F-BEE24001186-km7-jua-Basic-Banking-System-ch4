import morgan from "morgan";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swaggerOptions.js";
import errorHandler from "./errorHandler.js";

export default (app) => {
  // Logging
  app.use(morgan("dev"));

  // JSON Parsing
  app.use(express.json());

  // Swagger API Docs
  app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Error handling middleware 
  app.use(errorHandler);
};
