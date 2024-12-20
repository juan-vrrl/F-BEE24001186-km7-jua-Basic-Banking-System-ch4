import TransactionService from "../services/transactions.js";

const transactionService = new TransactionService();

// Create a new transaction
export const createTransaction = async (req, res, next) => {
  try {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

// Get all transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get a transaction by ID
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};
