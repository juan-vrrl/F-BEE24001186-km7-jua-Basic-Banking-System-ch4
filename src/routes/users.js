import express from "express";
import UserService from "../services/users.js";
import Joi from "joi";
import AppError from "../utils/AppError.js";

const router = express.Router();

const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // password must be at least 6 characters
  identityType: Joi.string().min(1).required(),
  identityNumber: Joi.string().min(1).required(),
  address: Joi.string().min(1).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(1),
  email: Joi.string().email(),
  address: Joi.string().min(1),
});

// Middleware to validate input using joi
const validateInput = (req, res, next) => {
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

const userService = new UserService();

// Create a new user
router.post("/", validateInput, async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Fetch all users
router.get("/", async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// Fetch a user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Update a user by ID
router.put("/:id", validateUpdateInput, async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
