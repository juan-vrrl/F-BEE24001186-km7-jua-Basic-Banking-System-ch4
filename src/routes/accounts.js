import express from "express";
import BankAccountService from "../services/accounts.js"; 
import Joi from "joi";

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
router.post("/", validateInput, async (req, res) => {
  try {
    const newAccount = await bankAccountService.createBankAccount(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all bank accounts
router.get("/", async (req, res) => {
  try {
    const bankAccounts = await bankAccountService.getAllBankAccounts();
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch a bank account by ID
router.get("/:id", async (req, res) => {
  try {
    const bankAccount = await bankAccountService.getBankAccountById(req.params.id);
    res.status(200).json(bankAccount);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete a bank account by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await bankAccountService.deleteBankAccount(req.params.id);
    res.status(200).json(deletedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deposit amount to a bank account
router.put("/:id/deposit", validateInputAmount, async (req, res) => {
  try {
    const accountId = req.params.id;
    const updatedAccount = await bankAccountService.depositAmount({ ...req.body, accountId});
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Withdraw amount from a bank account
router.put("/:id/withdraw", validateInputAmount, async (req, res) => {
  try {
    const accountId = req.params.id;
    const updatedAccount = await bankAccountService.withdrawAmount( {...req.body, accountId});
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
