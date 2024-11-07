import AuthService from "../auth";
import prismaMock from "../../utils/singleton";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError";

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("loginUser", () => {
    test("should login successfully with correct credentials", async () => {
      const payload = { email: "test@example.com", password: "password123" };
      const user = {
        id: 1,
        email: payload.email,
        password: "$2b$10$hashedPassword",
      };
      const token = "testToken";

      prismaMock.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockReturnValue(token);

      const result = await authService.loginUser(payload);

      // Assertions
      expect(result).toEqual({ token, user });
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: payload.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        payload.password,
        user.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    });

    test("should throw an error if email is not found", async () => {
      const payload = { email: "test@example.com", password: "wrongPassword" };

      prismaMock.user.findUnique.mockResolvedValue(null);

      // Assertions
      await expect(authService.loginUser(payload)).rejects.toThrow(AppError);
      await expect(authService.loginUser(payload)).rejects.toThrow(
        "Invalid email or password"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error logging in user:"),
        expect.any(Error)
      );
    });

    test("should throw an error if password is incorrect", async () => {
      const payload = { email: "test@example.com", password: "wrongPassword" };
      const user = {
        id: 1,
        email: payload.email,
        password: "$2b$10$hashedPassword",
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      // Assertions
      await expect(authService.loginUser(payload)).rejects.toThrow(AppError);
      await expect(authService.loginUser(payload)).rejects.toThrow(
        "Invalid email or password"
      );
    });
  });

  describe("createUser", () => {
    test("should create a new user successfully", async () => {
      const payload = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        identityType: "Passport",
        identityNumber: "A12345678",
        address: "123 Main St, Springfield, USA",
      };
      const hashedPassword = "$2b$10$hashedPassword";
      const newUser = {
        id: 1,
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        profile: {
          id: 1,
          userId: 1,
          identityType: payload.identityType,
          identityNumber: payload.identityNumber,
          address: payload.address,
        },
      };

      jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);
      prismaMock.user.create.mockResolvedValue(newUser);

      const result = await authService.createUser(payload);

      // Assertions
      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          name: payload.name,
          email: payload.email,
          password: hashedPassword,
          profile: {
            create: {
              identityType: payload.identityType,
              identityNumber: payload.identityNumber,
              address: payload.address,
            },
          },
        },
        include: { profile: true },
      });
    });

    test("should throw an error if email already exists", async () => {
      const payload = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        identityType: "Passport",
        identityNumber: "A12345678",
        address: "123 Main St, Springfield, USA",
      };

      const error = new Error();
      error.code = 'P2002'; // Unique constraint violation for Prisma
      prismaMock.user.create.mockRejectedValue(error);

      // Assertions
      await expect(authService.createUser(payload)).rejects.toThrow(AppError);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating user:"),
        expect.any(Error)
      );
    });

    test("should throw an error if creating the user fails", async () => {
      const payload = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        identityType: "Passport",
        identityNumber: "A12345678",
        address: "123 Main St, Springfield, USA",
      };

      prismaMock.user.create.mockRejectedValue(new Error());

      // Assertions
      await expect(authService.createUser(payload)).rejects.toThrow(Error);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating user:"),
        expect.any(Error)
      );
    });
  });
});
