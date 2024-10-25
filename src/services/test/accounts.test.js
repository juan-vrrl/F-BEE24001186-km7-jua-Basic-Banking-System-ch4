import BankAccountService from "../accounts.js";
import prismaMock from "../../utils/singleton.js";
import AppError from "../../utils/AppError.js";

describe("BankAccountService", () => {
  let bankAccountService;

  beforeEach(() => {
    bankAccountService = new BankAccountService();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mocking console.error
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original console.error after each test
  });

  // Grouping tests for Create operations
  describe("Create Operations", () => {
    test("createBankAccount should create a new bank account", async () => {
      const payload = {
        bankName: "My Bank",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      const newAccount = {
        id: 1,
        ...payload,
      };

      prismaMock.bank_Account.create.mockResolvedValue(newAccount);

      const result = await bankAccountService.createBankAccount(payload);

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
  });

  // Grouping tests for Deposit operations
  describe("Deposit Operations", () => {
    test("depositAmount should deposit an amount to the bank account", async () => {
      const payload = { amount: 500, accountId: 1 };

      const existingAccount = { id: 1, balance: 1000 };
      const updatedAccount = { id: 1, balance: 1500 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(existingAccount);
      prismaMock.bank_Account.update.mockResolvedValue(updatedAccount);

      const result = await bankAccountService.depositAmount(payload);

      expect(result).toEqual(updatedAccount);
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
      });
      expect(prismaMock.bank_Account.update).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
        data: { balance: existingAccount.balance + payload.amount },
      });
    });
  });

  // Grouping tests for Withdraw operations
  describe("Withdraw Operations", () => {
    test("withdrawAmount should withdraw an amount from the bank account", async () => {
      const payload = { amount: 500, accountId: 1 };

      const existingAccount = { id: 1, balance: 1000 };
      const updatedAccount = { id: 1, balance: 500 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(existingAccount);
      prismaMock.bank_Account.update.mockResolvedValue(updatedAccount);

      const result = await bankAccountService.withdrawAmount(payload);

      expect(result).toEqual(updatedAccount);
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
      });
      expect(prismaMock.bank_Account.update).toHaveBeenCalledWith({
        where: { id: parseInt(payload.accountId) },
        data: { balance: existingAccount.balance - payload.amount },
      });
    });

    test("withdrawAmount should throw an error if insufficient balance", async () => {
      const payload = { amount: 2000, accountId: 1 };

      const existingAccount = { id: 1, balance: 1000 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(existingAccount);

      await expect(bankAccountService.withdrawAmount(payload)).rejects.toThrow(
        AppError
      );
      await expect(bankAccountService.withdrawAmount(payload)).rejects.toThrow(
        "Insufficient balance"
      );

      // Check console.error for the specific error message and that an Error object was also logged
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error withdrawing amount:"),
        expect.any(Error) // This checks for an instance of Error
      );
    });
  });

  // Grouping tests for Fetch operations
  describe("Fetch Operations", () => {
    test("getAllBankAccounts should fetch all bank accounts", async () => {
      const bankAccounts = [{ id: 1, bankName: "My Bank", balance: 1000 }];

      prismaMock.bank_Account.findMany.mockResolvedValue(bankAccounts);

      const result = await bankAccountService.getAllBankAccounts();

      expect(result).toEqual(bankAccounts);
      expect(prismaMock.bank_Account.findMany).toHaveBeenCalled();
    });

    test("getBankAccountById should fetch a bank account by ID", async () => {
      const bankAccount = { id: 1, bankName: "My Bank", balance: 1000 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(bankAccount);

      const result = await bankAccountService.getBankAccountById(1);

      expect(result).toEqual(bankAccount);
      expect(prismaMock.bank_Account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true },
      });
    });
  });

  // Grouping tests for Delete operations
  describe("Delete Operations", () => {
    test("deleteBankAccount should delete a bank account by ID", async () => {
      const accountId = 1;

      const bankAccount = { id: accountId, bankName: "My Bank", balance: 1000 };

      prismaMock.bank_Account.findUnique.mockResolvedValue(bankAccount);
      prismaMock.bank_Account.delete.mockResolvedValue(bankAccount);

      const result = await bankAccountService.deleteBankAccount(accountId);

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

      await expect(
        bankAccountService.deleteBankAccount(accountId)
      ).rejects.toThrow(AppError);
      await expect(
        bankAccountService.deleteBankAccount(accountId)
      ).rejects.toThrow("Bank account not found");

      // Check console.error for the specific error message and that an Error object was also logged
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error deleting bank account:"),
        expect.any(Error) // This checks for an instance of Error
      );
    });
  });
});
