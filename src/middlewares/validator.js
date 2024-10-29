import Joi from "joi";

// Define schemas
const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  identityType: Joi.string().min(1).required(),
  identityNumber: Joi.string().min(1).required(),
  address: Joi.string().min(1).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(1),
  email: Joi.string().email(),
  address: Joi.string().min(1),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const bankAccountSchema = Joi.object({
  bankName: Joi.string().min(1).required(),
  bankAccountNumber: Joi.string().min(1).required(),
  balance: Joi.number().required(),
  userId: Joi.number().integer().required(),
});

const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  sourceId: Joi.number().integer().required(),
  destinationId: Joi.number().integer().required(),
});

const amountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

// Middleware functions for validation
const validateInputAccount = (req, res, next) => {
  const { error } = bankAccountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateTransactionInput = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateInputAmount = (req, res, next) => {
  const { error } = amountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateRegistration = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateInput = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export {
  validateInputAccount,
  validateTransactionInput,
  validateInputAmount,
  validateRegistration,
  validateUpdateInput,
  validateLogin,
};
