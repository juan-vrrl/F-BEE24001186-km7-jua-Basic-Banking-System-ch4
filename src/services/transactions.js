import prisma from "../utils/prisma.js";

class TransactionService {
  // Create new transaction
  async createTransaction(payload) {
    try {
      const { amount, source_id, destination_id } = payload;

      const sourceAccount = await prisma.bank_Account.findUnique({
        where: { id: source_id },
      });
      const destinationAccount = await prisma.bank_Account.findUnique({
        where: { id: destination_id },
      });

      // Check if source and destination accounts exist
      if (!sourceAccount || !destinationAccount) {
        throw new Error("Source or destination bank account not found.");
      }

      // Check if source account balance is sufficient
      if (sourceAccount.balance < amount) {
        throw new Error("Insufficient balance in the source account.");
      }

      const result = await prisma.$transaction(async (prisma) => {
        const newTransaction = await prisma.transaction.create({
          data: {
            amount,
            source_account: { connect: { id: source_id } },
            destination_account: { connect: { id: destination_id } },
          },
        });

        await prisma.bank_Account.update({
          where: { id: source_id },
          data: { balance: sourceAccount.balance - amount },
        });

        await prisma.bank_Account.update({
          where: { id: destination_id },
          data: { balance: destinationAccount.balance + amount },
        });

        return newTransaction;
      });

      return result;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new Error(error.message);
    }
  }

  // Fetch all transactions
  async getAllTransactions() {
    try {
      const transactions = await prisma.transaction.findMany();
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Error fetching transactions");
    }
  }

  // Fetch transaction by ID
  async getTransactionById(id) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          source_account: true,
          destination_account: true,
        },
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw new Error(`Error fetching transaction with ID ${id}`);
    }
  }

  // Update transaction by ID
  async updateTransaction(id, payload) {
    try {
      const { amount, source_id, destination_id } = payload;

      const updatedTransaction = await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: {
          amount,
          source_account: { connect: { id: source_id } },
          destination_account: { connect: { id: destination_id } },
        },
      });

      return updatedTransaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw new Error(`Error updating transaction with ID ${id}`);
    }
  }

  // Delete transaction by ID
  async deleteTransaction(id) {
    try {
      await prisma.transaction.delete({
        where: { id: parseInt(id) },
      });
      return { message: `Transaction with ID ${id} deleted successfully` };
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw new Error(`Error deleting transaction with ID ${id}`);
    }
  }
}

export default TransactionService;
