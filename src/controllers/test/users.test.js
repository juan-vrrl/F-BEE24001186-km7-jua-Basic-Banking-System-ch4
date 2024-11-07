import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
  updateProfilePicture,
} from "../users.js";
import UserService from "../../services/users.js";

// Mock the UserService
jest.mock("../../services/users.js");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { userId: 1 }, // Mock authenticated user's ID for getCurrentUser and updateProfilePicture
      file: null,
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
        { id: 1, name: "John Doe", email: "JohnDoe@email.com" },
        { id: 2, name: "Jane Doe", email: "JaneDoe@email.com" },
      ];
      UserService.prototype.getAllUsers.mockResolvedValue(users);

      await getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    test("should handle error when retrieving all users", async () => {
      const errorMessage = "Failed to get users";
      UserService.prototype.getAllUsers.mockRejectedValue(new Error(errorMessage));

      await getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getUserById", () => {
    test("should return a user by ID", async () => {
      const user = { id: 1, name: "John Doe", email: "JohnDoe@email.com" };
      req.params.id = 1;
      UserService.prototype.getUserById.mockResolvedValue(user);

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("should handle error when retrieving a user by ID", async () => {
      const errorMessage = "User not found";
      req.params.id = 1;
      UserService.prototype.getUserById.mockRejectedValue(new Error(errorMessage));

      await getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getCurrentUser", () => {
    test("should return the currently authenticated user", async () => {
      const user = { id: 1, name: "John Doe", email: "JohnDoe@email.com" };
      UserService.prototype.getUserById.mockResolvedValue(user);

      await getCurrentUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("should handle error when retrieving the current user", async () => {
      const errorMessage = "Current user not found";
      UserService.prototype.getUserById.mockRejectedValue(new Error(errorMessage));

      await getCurrentUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("updateUser", () => {
    test("should update a user", async () => {
      const payload = { name: "Jane Doe", email: "janedoe@example.com" };
      const updatedUser = { id: 1, ...payload };
      req.params.id = 1;
      req.body = payload;
      UserService.prototype.updateUser.mockResolvedValue(updatedUser);

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test("should handle error when updating a user", async () => {
      const errorMessage = "Failed to update user";
      req.params.id = 1;
      req.body = { name: "Jane Doe" };
      UserService.prototype.updateUser.mockRejectedValue(new Error(errorMessage));

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("deleteUser", () => {
    test("should delete a user", async () => {
      const deletedUser = { id: 1, name: "John Doe" };
      req.params.id = 1;
      UserService.prototype.deleteUser.mockResolvedValue(deletedUser);

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedUser);
    });

    test("should handle error when deleting a user", async () => {
      const errorMessage = "Failed to delete user";
      req.params.id = 1;
      UserService.prototype.deleteUser.mockRejectedValue(new Error(errorMessage));

      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("updateProfilePicture", () => {
    test("should update the user's profile picture", async () => {
      const userId = 1;
      req.user.userId = userId;
      req.file = { buffer: Buffer.from("test image content") };

      const updatedUser = { id: userId, profile: { profilePicture: "newUrl" } };
      UserService.prototype.updateProfilePicture.mockResolvedValue(updatedUser);

      await updateProfilePicture(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test("should return 400 error if no file is provided", async () => {
      await updateProfilePicture(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Please upload an image" });
    });

    test("should handle error when updating profile picture", async () => {
      const errorMessage = "Failed to update profile picture";
      req.file = { buffer: Buffer.from("test image content") };
      UserService.prototype.updateProfilePicture.mockRejectedValue(new Error(errorMessage));

      await updateProfilePicture(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });
});
