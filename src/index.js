import express from "express";
import path from "path";
import { createServer } from "http";
import Routes from "./routes/index.js";
import Middleware from "./middlewares/index.js";
import errorHandler from "./middlewares/errorHandler.js";

// Initialize express app
const app = express();
const server = createServer(app);

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
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  console.log(
    `Swagger docs available at http://localhost:3000/api/v1/api-docs`
  );
});
