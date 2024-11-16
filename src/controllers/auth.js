import AuthService from "../services/auth.js";

const authService = new AuthService();

// Register a new user
export const registerUser = async (req, res, next) => {
  try {
    const newUser = await authService.createUser(req.body, req.io);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Login a user
export const loginUser = async (req, res, next) => {
  try {
    const loginResponse = await authService.loginUser(req.body);
    res.status(200).json(loginResponse);
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await authService.forgotPassword(email);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    const response = await authService.resetPassword(
      token,
      newPassword,
      req.io
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
