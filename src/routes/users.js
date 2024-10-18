import express from "express";
import UserService from "../services/users.js";
import Joi from "joi";

const router = express.Router();

const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // password must be at least 6 characters
  identity_type: Joi.string().min(1).required(),
  identity_number: Joi.string().min(1).required(),
  address: Joi.string().min(1).required(),
});

// Middleware to validate input using joi
const validateInput = (req, res, next) => {
  const { error } = userSchema.validate(req.body); 
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); 
  }
  next();
};

const userService = new UserService();

// Create a new user
router.post("/", validateInput, async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a user by id
router.put("/:id", validateInput, async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
