import express from "express";
import path from "path";
import morgan from "morgan";
import users from "./routes/users.js";
import accounts from "./routes/accounts.js";
import transactions from "./routes/transactions.js";
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

// Routes
app.use("/api/v1/users", users);
app.use("/api/v1/accounts", accounts);
app.use("/api/v1/transactions", transactions);

// Render index.ejs for the root route
app.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});