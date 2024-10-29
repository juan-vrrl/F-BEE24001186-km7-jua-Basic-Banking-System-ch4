import BankAccountService from "../services/accounts.js";

const bankAccountService = new BankAccountService();

export const createBankAccount = async (req, res, next) => {
  try {
    const newAccount = await bankAccountService.createBankAccount(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
};

export const getAllBankAccounts = async (req, res, next) => {
  try {
    const bankAccounts = await bankAccountService.getAllBankAccounts();
    res.status(200).json(bankAccounts);
  } catch (error) {
    next(error);
  }
};

export const getBankAccountById = async (req, res, next) => {
  try {
    const bankAccount = await bankAccountService.getBankAccountById(req.params.id);
    res.status(200).json(bankAccount);
  } catch (error) {
    next(error);
  }
};

export const deleteBankAccount = async (req, res, next) => {
  try {
    const deletedMessage = await bankAccountService.deleteBankAccount(req.params.id);
    res.status(200).json(deletedMessage);
  } catch (error) {
    next(error);
  }
};

export const depositToBankAccount = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const amount = req.body.amount;
    const updatedAccount = await bankAccountService.depositAmount(accountId, amount);
    res.status(200).json(updatedAccount);
  } catch (error) {
    next(error);
  }
};

export const withdrawFromBankAccount = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const amount = req.body.amount;
    const updatedAccount = await bankAccountService.withdrawAmount(accountId, amount);
    res.status(200).json(updatedAccount);
  } catch (error) {
    next(error);
  }
};


