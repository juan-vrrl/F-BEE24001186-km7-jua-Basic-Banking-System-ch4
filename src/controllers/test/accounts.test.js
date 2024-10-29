import {
  createBankAccount,
  getAllBankAccounts,
  getBankAccountById,
  deleteBankAccount,
  depositToBankAccount,
  withdrawFromBankAccount,
} from "../accounts.js";
import BankAccountService from "../../services/accounts.js";

// Mock the BankAccountService
jest.mock("../../services/accounts.js");

describe("Bank Account Controller", () => {
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

  describe("createBankAccount", () => {
    test("should create a new account", async () => {
      req.body = {
        bankName: "My Bank",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      const newAccount = {
        id: 1,
        createdAt: new Date(),
        userId: 1,
        ...req.body,
      };

      BankAccountService.prototype.createBankAccount.mockResolvedValue(newAccount);

      await createBankAccount(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newAccount);
    });

    test("should handle error when creating an account", async () => {
      const errorMessage = "Failed to create account";
      BankAccountService.prototype.createBankAccount.mockRejectedValue(
        new Error(errorMessage)
      );

      await createBankAccount(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("getAllBankAccounts", () => {
    test("should return all accounts", async () => {
      const accounts = [
        {
          id: 1,
          bankName: "My Bank",
          bankAccountNumber: "12345",
          balance: 1000,
          createdAt: new Date(),
          userId: 1,
        },
        {
          id: 2,
          bankName: "Your Bank",
          bankAccountNumber: "54321",
          balance: 2000,
          createdAt: new Date(),
          userId: 2,
        },
      ];

      BankAccountService.prototype.getAllBankAccounts.mockResolvedValue(
        accounts
      );

      await getAllBankAccounts(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(accounts);
    });

    test("should handle error when fetching accounts", async () => {
      const errorMessage = "Failed to fetch accounts";
      BankAccountService.prototype.getAllBankAccounts.mockRejectedValue(
        new Error(errorMessage)
      );

      await getAllBankAccounts(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("getBankAccountById", () => {
    test("should return account by id", async () => {
      req.params.id = "1";
      const account = {
        id: 1,
        bankName: "My Bank",
        bankAccountNumber: "12345",
        balance: 1000,
        createdAt: new Date(),
        userId: 1,
      };
      BankAccountService.prototype.getBankAccountById.mockResolvedValue(
        account
      );

      await getBankAccountById(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(account);
    });

    test("should handle error when fetching account by id", async () => {
      req.params.id = "1";
      const errorMessage = "Failed to fetch account";
      BankAccountService.prototype.getBankAccountById.mockRejectedValue(
        new Error(errorMessage)
      );

      await getBankAccountById(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("deleteBankAccount", () => {
    test("should delete an account", async () => {
      req.params.id = "1";
      const deletedMessage = { message: `Bank account with ID ${req.params.id} deleted successfully` };
      BankAccountService.prototype.deleteBankAccount.mockResolvedValue(
        deletedMessage
      );

      await deleteBankAccount(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedMessage);
    });

    test("should handle error when deleting an account", async () => {
      req.params.id = "1";
      const errorMessage = "Failed to delete account";
      BankAccountService.prototype.deleteBankAccount.mockRejectedValue(
        new Error(errorMessage)
      );

      await deleteBankAccount(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("depositToBankAccount", () => {
    test("should deposit money", async () => {
      req.params.id = "1";
      req.body.amount = 50;
      const updatedAccount = { id: 1, balance: 150 };
      BankAccountService.prototype.depositAmount.mockResolvedValue(
        updatedAccount
      );

      await depositToBankAccount(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAccount);
    });

    test("should handle error when depositing money", async () => {
      req.params.id = "1";
      req.body.amount = 50;
      const errorMessage = "Failed to deposit money";
      BankAccountService.prototype.depositAmount.mockRejectedValue(
        new Error(errorMessage)
      );

      await depositToBankAccount(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("withdrawFromBankAccount", () => {
    test("should withdraw money", async () => {
      req.params.id = "1";
      req.body.amount = 30;
      const updatedAccount = { id: 1, balance: 70 };
      BankAccountService.prototype.withdrawAmount.mockResolvedValue(
        updatedAccount
      );

      await withdrawFromBankAccount(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAccount);
    });

    test("should handle error when withdrawing money", async () => {
      req.params.id = "1";
      req.body.amount = 30;
      const errorMessage = "Failed to withdraw money";
      BankAccountService.prototype.withdrawAmount.mockRejectedValue(
        new Error(errorMessage)
      );

      await withdrawFromBankAccount(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });
});
