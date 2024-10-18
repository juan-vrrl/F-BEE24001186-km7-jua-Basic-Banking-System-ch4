import prisma from '../utils/prisma.js';

class TransactionService {
  constructor() {
    this.prisma = prisma; // Use the shared Prisma instance
  }

  // Create new transaction
  async createTransaction(payload) {
    try {
      const { amount, sourceId, destinationId } = payload; 

      const sourceAccount = await this.prisma.bank_Account.findUnique({
        where: { id: sourceId }, 
      });
      const destinationAccount = await this.prisma.bank_Account.findUnique({
        where: { id: destinationId }, 
      });

      // Check if source and destination accounts exist
      if (!sourceAccount || !destinationAccount) {
        throw new Error("Source or destination bank account not found.");
      }

      // Check if source account balance is sufficient
      if (sourceAccount.balance < amount) {
        throw new Error("Insufficient balance in the source account.");
      }

      const result = await this.prisma.$transaction(async (prisma) => {
        const newTransaction = await prisma.transaction.create({
          data: {
            amount,
            sourceAccount: { connect: { id: sourceId } }, 
            destinationAccount: { connect: { id: destinationId } }, 
          },
        });

        await prisma.bank_Account.update({
          where: { id: sourceId }, 
          data: { balance: sourceAccount.balance - amount },
        });

        await prisma.bank_Account.update({
          where: { id: destinationId }, 
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
      const transactions = await this.prisma.transaction.findMany();
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Error fetching transactions");
    }
  }

  // Fetch transaction by ID
  async getTransactionById(id) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          sourceAccount: true, 
          destinationAccount: true, 
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
}

export default TransactionService;