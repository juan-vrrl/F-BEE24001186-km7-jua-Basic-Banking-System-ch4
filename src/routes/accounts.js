import express from "express";
import {
  createBankAccount,
  getAllBankAccounts,
  getBankAccountById,
  deleteBankAccount,
  depositToBankAccount,
  withdrawFromBankAccount,
} from "../controllers/accounts.js";
import { validateInputAccount, validateInputAmount } from "../middlewares/validator.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

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
 *     security:
 *      - BearerAuth: []
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
router.post("/", verifyToken, validateInputAccount, createBankAccount);

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Fetch all bank accounts
 *     tags: [Bank Accounts]
 *     security:
 *       - BearerAuth: []
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
router.get("/", verifyToken, getAllBankAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Fetch a single bank account by ID along with user information
 *     tags: [Bank Accounts]
 *     security:
 *     - BearerAuth: []
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
router.get("/:id", verifyToken, getBankAccountById);

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Delete a bank account by ID
 *     tags: [Bank Accounts]
 *     security:
 *      - BearerAuth: []
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
router.delete("/:id", verifyToken, deleteBankAccount);

/**
 * @swagger
 * /accounts/{id}/deposit:
 *   put:
 *     summary: Deposit amount to a bank account
 *     tags: [Bank Accounts]
 *     security:
 *       - BearerAuth: []
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
router.put("/:id/deposit", verifyToken, validateInputAmount, depositToBankAccount);

/**
 * @swagger
 * /accounts/{id}/withdraw:
 *   put:
 *     summary: Withdraw amount from a bank account
 *     tags: [Bank Accounts]
 *     security:
 *      - BearerAuth: []
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
router.put("/:id/withdraw", verifyToken, validateInputAmount, withdrawFromBankAccount);

export default router;
