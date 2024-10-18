import express from "express";
import TransactionService from "../services/transactions.js";
import Joi from "joi";

const router = express.Router();

const transactionSchema = Joi.object({
  amount: Joi.number().required(), 
  source_id: Joi.number().integer().required(), 
  destination_id: Joi.number().integer().required(),
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
router.post("/", validateInput, async (req, res) => {
  try {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id
    );
    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update transaction by ID
router.put("/:id", validateInput, async (req, res) => {
  try {
    const updatedTransaction = await transactionService.updateTransaction(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await transactionService.deleteTransaction(
      req.params.id
    );
    res.status(200).json(deletedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
