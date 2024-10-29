import express from "express";
import { validateTransactionInput } from "../middlewares/validator.js";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from "../controllers/transactions.js";

const router = express.Router();

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
 *     security:
 *     - BearerAuth: []
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
router.post("/", validateTransactionInput, createTransaction);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Fetch all transactions
 *     tags: [Transactions]
 *     security:
 *      - BearerAuth: []
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
router.get("/", getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Fetch a transaction by ID
 *     tags: [Transactions]
 *     security:
 *      - BearerAuth: []
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
router.get("/:id", getTransactionById);

export default router;
