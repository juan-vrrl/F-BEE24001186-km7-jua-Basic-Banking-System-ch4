import express from "express";
import TransactionService from "../services/transactions.js";
import Joi from "joi";
import AppError from "../utils/AppError.js";

const router = express.Router();

const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  sourceId: Joi.number().integer().required(),
  destinationId: Joi.number().integer().required(),
});

// Middleware to validate input using Joi
const validateInput = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const transactionService = new TransactionService();

// Create new transaction
router.post("/", validateInput, async (req, res, next) => {
  try {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
});

// Fetch all transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
});

// Fetch transaction by ID
router.get("/:id", async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id
    );

    if (!transaction) {
      return next(new AppError("Transaction not found", 404));
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
