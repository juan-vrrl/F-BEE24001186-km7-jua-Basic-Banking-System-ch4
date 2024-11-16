import "./instrument.mjs";
import express from "express";
import * as Sentry from "@sentry/node";
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";
import Routes from "./routes/index.js";
import Middleware from "./middlewares/index.js";
import Views from "./views/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import { initializeSocket } from "./utils/socket.js";

dotenv.config();

// Initialize express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server, app);

// Set the port
const PORT = process.env.PORT;

// View Engine
app.set("views", path.join(path.resolve(), "/src/views"));
app.set("view engine", "ejs");

// Configure middlewares
Middleware(app);

// Configure routes
Routes(app);

// Configure views
Views(app);

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
