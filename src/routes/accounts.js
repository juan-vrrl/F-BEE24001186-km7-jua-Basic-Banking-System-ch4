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

/**
 * @swagger
 * tags:
 *   name: Bank Accounts
 *   description: API to manage bank accounts
 */

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new bank account
 *     tags: [Bank Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *                 example: "Bank of Example"
 *               bankAccountNumber:
 *                 type: string
 *                 example: "123456789"
 *               balance:
 *                 type: number
 *                 format: number
 *                 example: 500.0
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Bank account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Invalid input data."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error."
 */
router.post("/", validateInput, async (req, res, next) => {
  try {
    const newAccount = await bankAccountService.createBankAccount(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Fetch all bank accounts
 *     tags: [Bank Accounts]
 *     responses:
 *       200:
 *         description: List of bank accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankAccount'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.get("/", async (req, res, next) => {
  try {
    const bankAccounts = await bankAccountService.getAllBankAccounts();
    res.status(200).json(bankAccounts);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Fetch a single bank account by ID along with user information
 *     tags: [Bank Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bank account
 *     responses:
 *       200:
 *         description: Bank account data including user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccountWithUser'
 *       404:
 *         description: Bank account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Bank account not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
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

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Delete a bank account by ID
 *     tags: [Bank Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bank account to be deleted
 *     responses:
 *       200:
 *         description: Bank account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       404:
 *         description: Bank account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Bank account not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
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

/**
 * @swagger
 * /accounts/{id}/deposit:
 *   put:
 *     summary: Deposit amount to a bank account
 *     tags: [Bank Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bank account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Amount'
 *     responses:
 *       200:
 *         description: Deposit successful
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Invalid input"
 *       404:
 *         description: Bank account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Account not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.put("/:id/deposit", validateInputAmount, async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const amount = req.body.amount;
    const updatedAccount = await bankAccountService.depositToBankAccount(
      accountId,
      amount
    );
    res.status(200).json(updatedAccount);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /accounts/{id}/withdraw:
 *   put:
 *     summary: Withdraw amount from a bank account
 *     tags: [Bank Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bank account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Invalid input"
 *       404:
 *         description: Bank account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Account not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.put("/:id/withdraw", validateInputAmount, async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const amount = req.body.amount;
    const updatedAccount = await bankAccountService.withdrawFromBankAccount(
      accountId,
      amount
    );
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
