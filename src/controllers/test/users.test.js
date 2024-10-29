import { getAllUsers, getUserById, updateUser, deleteUser } from "../users.js";
import UserService from "../../services/users.js";

// Mock the UserService
jest.mock("../../services/users.js");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
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

  describe("getAllUsers", () => {
    test("should return all users", async () => {
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

      UserService.prototype.getAllUsers.mockResolvedValue(users);

      await getAllUsers(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    test("should handle error when retrieving all users", async () => {
      const errorMessage = "Failed to get users";
      UserService.prototype.getAllUsers.mockRejectedValue(new Error(errorMessage));

      await getAllUsers(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getUserById", () => {
    test("should return a user by ID", async () => {
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

      req.params.id = 1;
      UserService.prototype.getUserById.mockResolvedValue(user);

      await getUserById(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("should handle error when retrieving a user by ID", async () => {
      const errorMessage = "User not found";
      req.params.id = 1;
      UserService.prototype.getUserById.mockRejectedValue(new Error(errorMessage));

      await getUserById(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("updateUser", () => {
    test("should update a user", async () => {
      const payload = {
        name: "Jane Doe",
        email: "janedoe@example.com",
        address: "456 Elm St",
      };

      const updatedUser = {
        id: 1,
        name: payload.name,
        email: payload.email,
        profile: { address: payload.address },
      };

      req.params.id = 1;
      req.body = payload;
      UserService.prototype.updateUser.mockResolvedValue(updatedUser);

      await updateUser(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test("should handle error when updating a user", async () => {
      const errorMessage = "Failed to update user";
      req.params.id = 1;
      req.body = { name: "Jane Doe" };
      UserService.prototype.updateUser.mockRejectedValue(new Error(errorMessage));

      await updateUser(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("deleteUser", () => {
    test("should delete a user", async () => {
      const deletedUser = {
        id: 1,
        name: "John Doe",
        email: "JohnDoe@email.com",
      };

      req.params.id = 1;
      UserService.prototype.deleteUser.mockResolvedValue(deletedUser);

      await deleteUser(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedUser);
    });

    test("should handle error when deleting a user", async () => {
      const errorMessage = "Failed to delete user";
      req.params.id = 1;
      UserService.prototype.deleteUser.mockRejectedValue(new Error(errorMessage));

      await deleteUser(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });
});
