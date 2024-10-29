import express from "express";
import path from "path";
import morgan from "morgan";
import users from "./routes/users.js";
import accounts from "./routes/accounts.js";
import auth from "./routes/auth.js";
import transactions from "./routes/transactions.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerOptions.js';
import errorHandler from "./middlewares/errorHandler.js";
import { createServer } from "http";

// Initialize express app
const app = express();
const server = createServer(app);

// View Engine
app.set("views", path.join(path.resolve(), "/src/views"));
app.set("view engine", "ejs");

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// API Docs
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/users", users);
app.use("/api/v1/accounts", accounts);
app.use("/api/v1/transactions", transactions);
app.use("/api/v1/auth", auth);

// View Engine Home Route
app.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});

// Error Handler
app.use(errorHandler); 

// Start the server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
    console.log(`Swagger docs available at http://localhost:3000/api/v1/api-docs`);
});
