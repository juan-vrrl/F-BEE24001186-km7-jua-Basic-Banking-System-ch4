import UserService from "../users";
import prismaMock from "../../utils/singleton";
import AppError from "../../utils/AppError";

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAllUsers", () => {
    test("should fetch all users with profile data", async () => {
      const users = [
        {
          id: 1,
          name: "John Doe",
          email: "JohnDoe@email.com",
          password: "password123",
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "JaneDoe@email.com",
          password: "password123",
        },
      ];

      prismaMock.user.findMany.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(result).toEqual(users);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        include: { profile: true },
      });
    });

    test("should handle errors when fetching users", async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error("Fetch error"));

      await expect(userService.getAllUsers()).rejects.toThrow(Error);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching users:",
        expect.any(Error)
      );
    });
  });

  describe("getUserById", () => {
    test("should fetch a user by ID with profile data", async () => {
      const user = {
        id: 1,
        name: "John Doe",
        email: "JohnDoe@email.com",
        password: "password123",
        profile: {
          id: 1,
          userId: 1,
          identityType: "Passport",
          identityNumber: "A12345678",
          address: "123 Main St, Springfield, USA",
        },
      };

      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(result).toEqual(user);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { profile: true },
      });
    });

    test("should throw an error if user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById(1)).rejects.toThrow(AppError);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching user:",
        expect.any(Error)
      );
    });
  });

  describe("updateUser", () => {
    test("should update a user by ID", async () => {
      const payload = {
        name: "Jane Doe",
        email: "janedoe@example.com",
        address: "456 Elm St",
      };
      const user = { id: 1, name: "John Doe", email: "johndoe@example.com" };
      const updatedUser = {
        id: 1,
        name: payload.name,
        email: payload.email,
        profile: { address: payload.address },
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, payload);

      expect(result).toEqual(updatedUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: payload.name,
          email: payload.email,
          profile: { update: { address: payload.address } },
        },
        include: { profile: true },
      });
    });

    test("should throw an error if user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const payload = { name: "Jane Doe", email: "janedoe@example.com" };

      await expect(userService.updateUser(1, payload)).rejects.toThrow(
        AppError
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating user:",
        expect.any(Error)
      );
    });
  });

  describe("deleteUser", () => {
    test("should delete a user by ID", async () => {
      const user = { id: 1, name: "John Doe", email: "johndoe@example.com" };

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.delete.mockResolvedValue(user);

      const result = await userService.deleteUser(1);

      expect(result).toEqual({
        message: `User with ID ${user.id} deleted successfully`,
      });
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw an error if user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.deleteUser(1)).rejects.toThrow(AppError);
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting user:",
        expect.any(Error)
      );
    });
  });
});
