import prisma from '../utils/prisma.js';

class BankAccountService {
  constructor() {
    this.prisma = prisma; 
  }

  // Create a new bank account
  async createBankAccount(payload) {
    try {
      const { bankName, bankAccountNumber, balance, userId } = payload;

      const newAccount = await this.prisma.bank_Account.create({
        data: {
          bankName, 
          bankAccountNumber, 
          balance,
          user: { connect: { id: userId } },
        },
      });

      return newAccount;
    } catch (error) {
      console.error("Error creating bank account:", error);
      throw new Error("Error creating bank account");
    }
  }

  // Deposit amount to bank account
  async depositAmount(payload) {
    try {
      const { amount, accountId } = payload;

      const account = await this.prisma.bank_Account.findUnique({
        where: { id: parseInt(accountId) }, 
      });

      if (!account) {
        throw new Error("Account not found");
      }

      const updatedAccount = await this.prisma.bank_Account.update({
        where: { id: parseInt(accountId) }, 
        data: { balance: account.balance + amount },
      });

      return updatedAccount;
    } catch (error) {
      console.error("Error depositing amount:", error);
      throw new Error("Error depositing amount");
    }
  }

  // Withdraw amount from bank account
  async withdrawAmount(payload) {
    try {
      const { amount, accountId } = payload;

      const account = await this.prisma.bank_Account.findUnique({
        where: { id: parseInt(accountId) }, 
      });

      if (!account) {
        throw new Error("Account not found");
      }

      if (account.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const updatedAccount = await this.prisma.bank_Account.update({
        where: { id: parseInt(accountId) }, 
        data: { balance: account.balance - amount },
      });

      return updatedAccount;
    } catch (error) {
      console.error("Error withdrawing amount:", error);
      throw new Error(error.message);
    }
  }

  // Fetch all bank accounts
  async getAllBankAccounts() {
    try {
      const bankAccounts = await this.prisma.bank_Account.findMany();
      return bankAccounts;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw new Error("Error fetching bank accounts");
    }
  }

  // Fetch a single bank account by ID
  async getBankAccountById(id) {
    try {
      const bankAccount = await this.prisma.bank_Account.findUnique({
        where: { id: parseInt(id) },
        include: { user: true },
      });
      if (!bankAccount) {
        throw new Error("Bank account not found");
      }
      return bankAccount;
    } catch (error) {
      console.error("Error fetching bank account:", error);
      throw new Error(`Error fetching bank account with ID ${id}`);
    }
  }

  // Delete a bank account by ID
  async deleteBankAccount(id) {
    try {
      await this.prisma.bank_Account.delete({
        where: { id: parseInt(id) },
      });
      return { message: `Bank account with ID ${id} deleted successfully` };
    } catch (error) {
      console.error("Error deleting bank account:", error);
      throw new Error(`Error deleting bank account with ID ${id}`);
    }
  }
}

export default BankAccountService;