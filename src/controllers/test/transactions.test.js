import { createTransaction, getAllTransactions, getTransactionById } from "../transactions.js";
import TransactionService from "../../services/transactions.js";

// Mock the TransactionService
jest.mock("../../services/transactions.js");

describe("Transaction Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTransaction", () => {
    test("should create a new transaction", async () => {
      const payload = {
        amount: 200,
        sourceId: 1,
        destinationId: 2,
      };

      const newTransaction = {
        id: 1,
        amount: payload.amount,
        sourceAccountId: payload.sourceId,
        destinationAccountId: payload.destinationId,
        createdAt: new Date(),
      };

      req.body = payload;
      TransactionService.prototype.createTransaction.mockResolvedValue(newTransaction);

      await createTransaction(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTransaction);
    });

    test("should handle error when creating a transaction", async () => {
      const errorMessage = "Failed to create transaction";
      TransactionService.prototype.createTransaction.mockRejectedValue(new Error(errorMessage));

      req.body = { amount: 200, sourceId: 1, destinationId: 2 };

      await createTransaction(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getAllTransactions", () => {
    test("should return all transactions", async () => {
      const transactions = [
        { id: 1, amount: 200, sourceAccountId: 1, destinationAccountId: 2 },
        { id: 2, amount: 300, sourceAccountId: 1, destinationAccountId: 3 },
      ];

      TransactionService.prototype.getAllTransactions.mockResolvedValue(transactions);

      await getAllTransactions(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(transactions);
    });

    test("should handle error when retrieving all transactions", async () => {
      const errorMessage = "Failed to get transactions";
      TransactionService.prototype.getAllTransactions.mockRejectedValue(new Error(errorMessage));

      await getAllTransactions(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getTransactionById", () => {
    test("should return a transaction by ID", async () => {
      const transaction = {
        id: 1,
        amount: 200,
        sourceAccountId: 1,
        destinationAccountId: 2,
        sourceAccount: { id: 1, balance: 1000 },
        destinationAccount: { id: 2, balance: 500 },
      };

      req.params.id = 1;
      TransactionService.prototype.getTransactionById.mockResolvedValue(transaction);

      await getTransactionById(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(transaction);
    });

    test("should handle error when retrieving a transaction by ID", async () => {
      const errorMessage = "Transaction not found";
      req.params.id = 1;
      TransactionService.prototype.getTransactionById.mockRejectedValue(new Error(errorMessage));

      await getTransactionById(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });
});
