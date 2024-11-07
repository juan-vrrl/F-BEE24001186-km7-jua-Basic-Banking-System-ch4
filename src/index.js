import express from "express";
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";               
import Routes from "./routes/index.js";
import Middleware from "./middlewares/index.js";
import errorHandler from "./middlewares/errorHandler.js";

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const server = createServer(app);

// Set the port (use 3000 as a fallback if not set in environment)
const PORT = process.env.PORT || 3000;

// View Engine
app.set("views", path.join(path.resolve(), "/src/views"));
app.set("view engine", "ejs");

// Configure middleware
Middleware(app);

// Configure routes
Routes(app);

// Error handling 
app.use(errorHandler);

// View Engine Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/v1/api-docs`);
});
