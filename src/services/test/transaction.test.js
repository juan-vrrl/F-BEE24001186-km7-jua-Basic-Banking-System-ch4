import TransactionService from "../transactions.js";
import prismaMock from "../../utils/singleton.js";
import AppError from "../../utils/AppError.js";

describe("TransactionService", () => {
  let transactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createTransaction", () => {
    test("createTransaction should create a new transaction and update account balances", async () => {
      const payload = {
        amount: 200,
        sourceId: 1,
        destinationId: 2,
      };

      const sourceAccount = { id: 1, balance: 1000 };
      const destinationAccount = { id: 2, balance: 500 };
      const newTransaction = {
        id: 1,
        amount: payload.amount,
        sourceAccountId: payload.sourceId,
        destinationAccountId: payload.destinationId,
        createdAt: new Date(),
      };

      prismaMock.bank_Account.findUnique
        .mockResolvedValueOnce(sourceAccount) // Source account
        .mockResolvedValueOnce(destinationAccount); // Destination account

      prismaMock.$transaction.mockImplementation(
        async (transactionCallback) => {
          prismaMock.transaction.create = jest
            .fn()
            .mockResolvedValue(newTransaction);

          prismaMock.bank_Account.update = jest.fn().mockResolvedValue(true);

          return await transactionCallback(prismaMock);
        }
      );

      const result = await transactionService.createTransaction(payload);

      // Assertions
      expect(result).toEqual(newTransaction);
      expect(prismaMock.$transaction).toHaveBeenCalledWith(
        expect.any(Function)
      );

      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          amount: payload.amount,
          sourceAccount: { connect: { id: payload.sourceId } },
          destinationAccount: { connect: { id: payload.destinationId } },
        },
      });

      expect(prismaMock.bank_Account.update).toHaveBeenCalledWith({
        where: { id: payload.sourceId },
        data: { balance: sourceAccount.balance - payload.amount },
      });

      expect(prismaMock.bank_Account.update).toHaveBeenCalledWith({
        where: { id: payload.destinationId },
        data: { balance: destinationAccount.balance + payload.amount },
      });
    });

    test("createTransaction should throw an error if source or destination account not found", async () => {
      const payload = { amount: 200, sourceId: 1, destinationId: 2 };

      prismaMock.bank_Account.findUnique.mockResolvedValueOnce(null);

      //Assertions
      await expect(
        transactionService.createTransaction(payload)
      ).rejects.toThrow(AppError);
      await expect(
        transactionService.createTransaction(payload)
      ).rejects.toThrow("Source or destination bank account not found.");

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating transaction:"),
        expect.any(Error)
      );
    });

    test("createTransaction should throw an error if insufficient balance in source account", async () => {
      const payload = { amount: 2000, sourceId: 1, destinationId: 2 };
      const sourceAccount = { id: 1, balance: 500 };
      const destinationAccount = { id: 2, balance: 1000 };

      prismaMock.bank_Account.findUnique
        .mockResolvedValueOnce(sourceAccount)
        .mockResolvedValueOnce(destinationAccount);

      //Assertions
      await expect(
        transactionService.createTransaction(payload)
      ).rejects.toThrow("Insufficient balance in the source account.");

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating transaction:"),
        expect.any(Error)
      );
    });
  });

  describe("getAllTransactions", () => {
    test("getAllTransactions should fetch all transactions", async () => {
      const transactions = [
        { id: 1, amount: 200, sourceAccountId: 1, destinationAccountId: 2 },
        { id: 2, amount: 300, sourceAccountId: 1, destinationAccountId: 3 },
      ];

      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      const result = await transactionService.getAllTransactions();

      // Assertions
      expect(result).toEqual(transactions);
      expect(prismaMock.transaction.findMany).toHaveBeenCalled();
    });

    test("getAllTransactions should throw an error when fetching fails", async () => {
      prismaMock.transaction.findMany.mockRejectedValue(new Error());

      await expect(transactionService.getAllTransactions()).rejects.toThrow(
        Error
      );

      // Assertions
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching transactions:"),
        expect.any(Error)
      );
    });
  });

  describe("getTransactionById", () => {
    test("getTransactionById should fetch a transaction by ID", async () => {
      const transaction = {
        id: 1,
        amount: 200,
        sourceAccountId: 1,
        destinationAccountId: 2,
        sourceAccount: { id: 1, balance: 1000 },
        destinationAccount: { id: 2, balance: 500 },
      };

      prismaMock.transaction.findUnique.mockResolvedValue(transaction);

      const result = await transactionService.getTransactionById(1);

      expect(result).toEqual(transaction);
      expect(prismaMock.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { sourceAccount: true, destinationAccount: true },
      });
    });

    test("getTransactionById should throw an error if transaction not found", async () => {
      prismaMock.transaction.findUnique.mockResolvedValue(null);

      await expect(transactionService.getTransactionById(1)).rejects.toThrow(
        AppError
      );
      await expect(transactionService.getTransactionById(1)).rejects.toThrow(
        "Transaction not found"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching transaction:"),
        expect.any(Error)
      );
    });
  });
});
