import AuthService from "../services/auth.js";

const authService = new AuthService();

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await authService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const loginResponse = await authService.loginUser(req.body);
    res.status(200).json(loginResponse);
  } catch (error) {
    next(error);
  }
};
