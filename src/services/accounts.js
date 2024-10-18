import prisma from "../utils/prisma.js";

class BankAccountService {
  // Create a new bank account
  async createBankAccount(payload) {
    try {
      const { bank_name, bank_account_number, balance, user_id } = payload;

      const newAccount = await prisma.bank_Account.create({
        data: {
          bank_name,
          bank_account_number,
          balance,
          user: { connect: { id: user_id } },
        },
      });

      return newAccount;
    } catch (error) {
      console.error("Error creating bank account:", error);
      throw new Error("Error creating bank account");
    }
  }

  // Fetch all bank accounts
  async getAllBankAccounts() {
    try {
      const bankAccounts = await prisma.bank_Account.findMany();
      return bankAccounts;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw new Error("Error fetching bank accounts");
    }
  }

  // Fetch a single bank account by ID
  async getBankAccountById(id) {
    try {
      const bankAccount = await prisma.bank_Account.findUnique({
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

  // Update a bank account by ID
  async updateBankAccount(id, payload) {
    try {
      const { bank_name, bank_account_number, balance } = payload;

      const updatedAccount = await prisma.bank_Account.update({
        where: { id: parseInt(id) },
        data: {
          bank_name,
          bank_account_number,
          balance,
        },
      });

      return updatedAccount;
    } catch (error) {
      console.error("Error updating bank account:", error);
      throw new Error(`Error updating bank account with ID ${id}`);
    }
  }

  // Delete a bank account by ID
  async deleteBankAccount(id) {
    try {
      await prisma.bank_Account.delete({
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
