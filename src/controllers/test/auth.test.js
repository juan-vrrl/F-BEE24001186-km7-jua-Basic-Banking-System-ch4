import { registerUser, loginUser } from "../auth.js";
import AuthService from "../../services/auth.js";

// Mock the AuthService
jest.mock("../../services/auth.js");

describe("Auth Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
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
});
