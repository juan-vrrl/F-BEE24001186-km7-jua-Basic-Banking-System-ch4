import { registerUser, loginUser, forgotPassword, resetPassword } from "../auth.js";
import AuthService from "../../services/auth.js";

// Mock the AuthService
jest.mock("../../services/auth.js");

describe("Auth Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {}, 
      body: {},  
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    test("should register a new user", async () => {
      req.body = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        identityType: "Passport",
        identityNumber: "A12345678",
        address: "123 Main St, Springfield, USA",
      };

      const newUser = {
        id: 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profile: {
          id: 1,
          userId: 1,
          identityType: req.body.identityType,
          identityNumber: req.body.identityNumber,
          address: req.body.address,
        },
      };

      AuthService.prototype.createUser.mockResolvedValue(newUser);

      await registerUser(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });

    test("should handle error when registering a user", async () => {
      const errorMessage = "Failed to register user";
      AuthService.prototype.createUser.mockRejectedValue(
        new Error(errorMessage)
      );

      await registerUser(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("loginUser", () => {
    test("should login a user", async () => {
      req.body = { email: "johndoe@example.com", password: "testPassword" };
      const loginResponse = {
        token: "dummyToken",
        user: { id: 1, email: "johndoe@example.com" },
      };
      AuthService.prototype.loginUser.mockResolvedValue(loginResponse);

      await loginUser(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(loginResponse);
    });

    test("should handle error when logging in a user", async () => {
      const errorMessage = "Failed to login user";
      AuthService.prototype.loginUser.mockRejectedValue(
        new Error(errorMessage)
      );

      await loginUser(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: errorMessage })
      );
    });
  });

  describe("forgotPassword", () => {
    test("should send a password reset email if the user exists", async () => {
      const email = "test@example.com";
      req.body = { email };
      const response = { message: "Password reset link sent to your email" };

      AuthService.prototype.forgotPassword.mockResolvedValue(response);

      await forgotPassword(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
      expect(AuthService.prototype.forgotPassword).toHaveBeenCalledWith(email);
    });

    test("should handle error when email is not associated with any user", async () => {
      const email = "test@example.com";
      req.body = { email };
      const errorMessage = "No user found with this email";

      AuthService.prototype.forgotPassword.mockRejectedValue(new Error(errorMessage));

      await forgotPassword(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });

    test("should handle other errors during password reset process", async () => {
      const email = "test@example.com";
      req.body = { email };
      const errorMessage = "An error occurred during the password reset process";

      AuthService.prototype.forgotPassword.mockRejectedValue(new Error(errorMessage));

      await forgotPassword(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("resetPassword", () => {
    test("should reset the password successfully", async () => {
      const token = "testToken";
      const newPassword = "newPassword123";
      req.query.token = token;
      req.body.newPassword = newPassword;

      const response = { message: "Password successfully reset" };

      AuthService.prototype.resetPassword.mockResolvedValue(response);

      await resetPassword(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
      expect(AuthService.prototype.resetPassword).toHaveBeenCalledWith(token, newPassword);
    });

    test("should handle error when the reset token is invalid or expired", async () => {
      const token = "invalidToken";
      const newPassword = "newPassword123";
      req.query.token = token;
      req.body.newPassword = newPassword;
      const errorMessage = "Token expired. Please request a new password reset link.";

      AuthService.prototype.resetPassword.mockRejectedValue(new Error(errorMessage));

      await resetPassword(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });

    test("should handle other errors during password reset", async () => {
      const token = "testToken";
      const newPassword = "newPassword123";
      req.query.token = token;
      req.body.newPassword = newPassword;
      const errorMessage = "An error occurred during the password reset process";

      AuthService.prototype.resetPassword.mockRejectedValue(new Error(errorMessage));

      await resetPassword(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });
});
