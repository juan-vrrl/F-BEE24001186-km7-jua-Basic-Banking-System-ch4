import "./instrument.mjs";
import express from "express";
import * as Sentry from "@sentry/node";
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";
import Routes from "./routes/index.js";
import Middleware from "./middlewares/index.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

// Initialize express app
const app = express();
const server = createServer(app);

// Set the port
const PORT = process.env.PORT;

// View Engine
app.set("views", path.join(path.resolve(), "/src/views"));
app.set("view engine", "ejs");

// Configure middlewares
Middleware(app);

// Configure routes
Routes(app);

// View Engine 
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    docs_url: `http://${process.env.APP_URL}/api/v1/api-docs`,
  });
});

app.get("/reset-password", (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send("Invalid or missing token.");
  }
  res.render("resetPassword", { token });
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Error handling
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://${process.env.APP_URL}`);
  console.log(
    `Swagger docs available at http://${process.env.APP_URL}/api/v1/api-docs`
  );
});
