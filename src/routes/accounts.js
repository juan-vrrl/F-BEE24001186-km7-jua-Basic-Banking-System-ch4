import express from "express";
import BankAccountService from "../services/accounts.js";
import Joi from "joi";
import AppError from "../utils/AppError.js";

const router = express.Router();

const bankAccountSchema = Joi.object({
  bankName: Joi.string().min(1).required(),
  bankAccountNumber: Joi.string().min(1).required(),
  balance: Joi.number().required(),
  userId: Joi.number().integer().required(),
});

const amountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

// Middleware to validate input using Joi
const validateInput = (req, res, next) => {
  const { error } = bankAccountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateInputAmount = (req, res, next) => {
  const { error } = amountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const bankAccountService = new BankAccountService();

// Create a new bank account
router.post("/", validateInput, async (req, res, next) => {
  try {
    const newAccount = await bankAccountService.createBankAccount(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
});

// Fetch all bank accounts
router.get("/", async (req, res, next) => {
  try {
    const bankAccounts = await bankAccountService.getAllBankAccounts();
    res.status(200).json(bankAccounts);
  } catch (error) {
    next(error);
  }
});

// Fetch a single bank account by ID
router.get("/:id", async (req, res, next) => {
  try {
    const bankAccount = await bankAccountService.getBankAccountById(
      req.params.id
    );
    res.status(200).json(bankAccount);
  } catch (error) {
    next(error);
  }
});

// Delete a bank account by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedMessage = await bankAccountService.deleteBankAccount(
      req.params.id
    );
    res.status(200).json(deletedMessage);
  } catch (error) {
    next(error);
  }
});

// Deposit amount to a bank account
router.put("/:id/deposit", validateInputAmount, async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const updatedAccount = await bankAccountService.depositAmount({
      ...req.body,
      accountId,
    });
    res.status(200).json(updatedAccount);
  } catch (error) {
    next(error);
  }
});

// Withdraw amount from a bank account
router.put("/:id/withdraw", validateInputAmount, async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const updatedAccount = await bankAccountService.withdrawAmount({
      ...req.body,
      accountId,
    });
    res.status(200).json(updatedAccount);
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
