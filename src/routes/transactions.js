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

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API to manage transactions
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
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
 *               sourceId:
 *                 type: integer
 *                 example: 1
 *               destinationId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
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
 *                 error: "Insufficient balance in the source account."
 *       404:
 *         description: Source or destination account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Source or destination bank account not found."
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
router.post("/", validateInput, async (req, res, next) => {
  try {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Fetch all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
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
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Fetch a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transaction to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A transaction object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Transaction not found"
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
