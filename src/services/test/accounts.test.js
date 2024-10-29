import BankAccountService from "../accounts.js";
import prismaMock from "../../utils/singleton.js";
import AppError from "../../utils/AppError.js";

describe("BankAccountService", () => {
  let bankAccountService;

  beforeEach(() => {
    bankAccountService = new BankAccountService();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createBankAccount", () => {
    test("createBankAccount should create a new bank account", async () => {
      const payload = {
        bankName: "My Bank",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      const newAccount = {
        id: 1,
        createdAt: new Date(),
        userId: 1,
        ...payload,
      };

      prismaMock.bank_Account.create.mockResolvedValue(newAccount);

      const result = await bankAccountService.createBankAccount(payload);

      // Assertions
      expect(result).toEqual(newAccount);
      expect(prismaMock.bank_Account.create).toHaveBeenCalledWith({
        data: {
          bankName: payload.bankName,
          bankAccountNumber: payload.bankAccountNumber,
          balance: payload.balance,
          user: { connect: { id: payload.userId } },
        },
      });
    });

    test("createBankAccount should throw an error if creation fails", async () => {
      const payload = {
        bankName: "My Bank",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      prismaMock.bank_Account.create.mockRejectedValue(new Error());

      // Assertions
      await expect(
        bankAccountService.createBankAccount(payload)
      ).rejects.toThrow(Error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating bank account:"),
        expect.any(Error)
      );
    });
  });

  // depositAmount
  describe("depositAmount", () => {
    test("depositAmount should deposit an amount to the bank account", async () => {
      const payload = { amount: 500, accountId: 1 };

      const existingAccount = { id: 1, balance: 1000 };
      const updatedAccount = { id: 1, balance: 1500 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(existingAccount);
      prismaMock.bank_Account.update.mockResolvedValue(updatedAccount);

      const result = await bankAccountService.depositAmount(payload);

      // Assertions
      expect(result).toEqual(updatedAccount);
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
      });
      expect(prismaMock.bank_Account.update).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
        data: { balance: existingAccount.balance + payload.amount },
      });
    });

    test("depositAmount should throw an error if account ID not found", async () => {
      const payload = { amount: 500, accountId: 1 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(null);

      // Assertions
      await expect(bankAccountService.depositAmount(payload)).rejects.toThrow(
        AppError
      );
      await expect(bankAccountService.depositAmount(payload)).rejects.toThrow(
        "Account not found"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error depositing amount:"),
        expect.any(Error)
      );
    });
  });

  // withdrawAmount
  describe("withdrawAmount", () => {
    test("withdrawAmount should withdraw an amount from the bank account", async () => {
      const payload = { amount: 500, accountId: 1 };

      const existingAccount = { id: 1, balance: 1000 };
      const updatedAccount = { id: 1, balance: 500 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(existingAccount);
      prismaMock.bank_Account.update.mockResolvedValue(updatedAccount);

      const result = await bankAccountService.withdrawAmount(payload);

      // Assertions
      expect(result).toEqual(updatedAccount);
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
      });
      expect(prismaMock.bank_Account.update).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
        data: { balance: existingAccount.balance - payload.amount },
      });
    });

    test("withdrawAmount should throw an error if account ID not found", async () => {
      const payload = { amount: 500, accountId: 1 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(null);

      // Assertions
      await expect(bankAccountService.withdrawAmount(payload)).rejects.toThrow(
        AppError
      );
      await expect(bankAccountService.withdrawAmount(payload)).rejects.toThrow(
        "Account not found"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error withdrawing amount:"),
        expect.any(Error)
      );
    });

    test("withdrawAmount should throw an error if insufficient balance", async () => {
      const payload = { amount: 2000, accountId: 1 };

      const existingAccount = { id: 1, balance: 1000 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(existingAccount);

      // Assertions
      await expect(bankAccountService.withdrawAmount(payload)).rejects.toThrow(
        AppError
      );
      await expect(bankAccountService.withdrawAmount(payload)).rejects.toThrow(
        "Insufficient balance"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error withdrawing amount:"),
        expect.any(Error)
      );
    });
  });

  // getAllBankAccounts
  describe("getAllBankAccounts", () => {
    test("getAllBankAccounts should fetch all bank accounts", async () => {
      const bankAccounts = [
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

      prismaMock.bank_Account.findMany.mockResolvedValue(bankAccounts);

      const result = await bankAccountService.getAllBankAccounts();

      // Assertions
      expect(result).toEqual(bankAccounts);
      expect(prismaMock.bank_Account.findMany).toHaveBeenCalled();
    });

    test("getAllBankAccounts should throw an error if fetching fails", async () => {
      prismaMock.bank_Account.findMany.mockRejectedValue(new Error());

      // Assertions
      await expect(bankAccountService.getAllBankAccounts()).rejects.toThrow(
        Error
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching bank accounts:"),
        expect.any(Error)
      );
    });
  });

  // getBankAccountById
  describe("getBankAccountById", () => {
    test("getBankAccountById should fetch a bank account by ID", async () => {
      const bankAccount = {
        id: 1,
        bankName: "My Bank",
        bankAccountNumber: "12345",
        balance: 1000,
        createdAt: new Date(),
        userId: 1,
      };

      prismaMock.bank_Account.findUnique.mockResolvedValue(bankAccount);

      const result = await bankAccountService.getBankAccountById(1);

      // Assertions
      expect(result).toEqual(bankAccount);
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true },
      });
    });

    test("getBankAccountById should throw an error if bank account not found", async () => {
      prismaMock.bank_Account.findUnique.mockResolvedValue(null);

      // Assertions
      await expect(bankAccountService.getBankAccountById(1)).rejects.toThrow(
        AppError
      );
      await expect(bankAccountService.getBankAccountById(1)).rejects.toThrow(
        "Bank account not found"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching bank account:"),
        expect.any(Error)
      );
    });
  });

  // deleteBankAccount
  describe("deleteBankAccount", () => {
    test("deleteBankAccount should delete a bank account by ID", async () => {
      const accountId = 1;

      const bankAccount = { id: accountId, bankName: "My Bank", balance: 1000 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(bankAccount);
      prismaMock.bank_Account.delete.mockResolvedValue(bankAccount);

      const result = await bankAccountService.deleteBankAccount(accountId);

      // Assertions
      expect(result).toEqual({
        message: `Bank account with ID ${accountId} deleted successfully`,
      });
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: accountId },
      });
      expect(prismaMock.bank_Account.delete).toHaveBeenCalledWith({
        where: { id: accountId },
      });
    });

    test("deleteBankAccount should throw an error if bank account not found", async () => {
      const accountId = 1;

      prismaMock.bank_Account.findUnique.mockResolvedValue(null);

      // Assertions
      await expect(
        bankAccountService.deleteBankAccount(accountId)
      ).rejects.toThrow(AppError);
      await expect(
        bankAccountService.deleteBankAccount(accountId)
      ).rejects.toThrow("Bank account not found");

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error deleting bank account:"),
        expect.any(Error)
      );
    });
  });
});
