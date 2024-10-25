import prisma from '../utils/prisma.js';
import AppError from '../utils/AppError.js';

class TransactionService {
  constructor() {
    this.prisma = prisma; 
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
        throw new AppError("Source or destination bank account not found.", 404); 
      }

      // Check if source account balance is sufficient
      if (sourceAccount.balance < amount) {
        throw new AppError("Insufficient balance in the source account.", 400); 
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
      throw error; 
    }
  }

  // Fetch all transactions
  async getAllTransactions() {
    try {
      const transactions = await this.prisma.transaction.findMany();
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error; 
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
        throw new AppError("Transaction not found", 404); 
      }
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error; 
    }
  }
}

export default TransactionService;
