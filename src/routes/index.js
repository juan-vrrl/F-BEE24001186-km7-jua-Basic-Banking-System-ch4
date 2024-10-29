import express from "express";
import users from "./users.js";
import accounts from "./accounts.js";
import auth from "./auth.js";
import transactions from "./transactions.js";

export default (app) => {
  const router = express.Router();

  router.use("/users", users);
  router.use("/accounts", accounts);
  router.use("/transactions", transactions);
  router.use("/auth", auth);
  
  app.use("/api/v1", router);
};
