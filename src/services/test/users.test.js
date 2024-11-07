import UserService from "../users";
import prismaMock from "../../utils/singleton";
import AppError from "../../utils/AppError";
import imagekit from "../../utils/imageKit";

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    jest.spyOn(console, "error").mockImplementation(() => {});

    imagekit.upload = jest.fn();
    imagekit.deleteFile = jest.fn();
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

  describe("updateProfilePicture", () => {
    test("should update user's profile picture and delete the old one", async () => {
      const userId = 1;
      const file = { buffer: Buffer.from("file content") };

      // Mock existing user with an old profile picture
      const user = {
        id: userId,
        name: "John Doe",
        profile: { profilePictureId: "oldFileId", profilePicture: "oldUrl" },
      };
      prismaMock.user.findUnique.mockResolvedValue(user);

      // Mock imageKit upload and delete methods
      const uploadResult = { url: "newUrl", fileId: "newFileId" };
      imagekit.upload.mockResolvedValue(uploadResult);
      imagekit.deleteFile.mockResolvedValue(true);

      // Mock updating user profile
      const updatedUser = {
        id: userId,
        name: "John Doe",
        profile: {
          profilePictureId: uploadResult.fileId,
          profilePicture: uploadResult.url,
        },
      };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateProfilePicture(userId, file);

      expect(result).toEqual(updatedUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { profile: true },
      });
      expect(imagekit.deleteFile).toHaveBeenCalledWith("oldFileId");
      expect(imagekit.upload).toHaveBeenCalledWith({
        file: file.buffer,
        fileName: `profile_${userId}`,
        folder: "/profile_pictures/",
      });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          profile: {
            update: {
              profilePicture: uploadResult.url,
              profilePictureId: uploadResult.fileId,
            },
          },
        },
        include: { profile: true },
      });
    });

    test("should upload a new profile picture when no previous picture exists", async () => {
      const userId = 1;
      const file = { buffer: Buffer.from("file content") };

      const user = {
        id: userId,
        name: "John Doe",
        profile: { profilePictureId: null, profilePicture: null },
      };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const uploadResult = { url: "newUrl", fileId: "newFileId" };
      imagekit.upload.mockResolvedValue(uploadResult);

      const updatedUser = {
        id: userId,
        name: "John Doe",
        profile: {
          profilePictureId: uploadResult.fileId,
          profilePicture: uploadResult.url,
        },
      };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateProfilePicture(userId, file);

      expect(result).toEqual(updatedUser);
      expect(imagekit.upload).toHaveBeenCalledWith({
        file: file.buffer,
        fileName: `profile_${userId}`,
        folder: "/profile_pictures/",
      });
      expect(imagekit.deleteFile).not.toHaveBeenCalled();
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          profile: {
            update: {
              profilePicture: uploadResult.url,
              profilePictureId: uploadResult.fileId,
            },
          },
        },
        include: { profile: true },
      });
    });

    test("should throw an error if user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const file = { buffer: Buffer.from("file content") };

      await expect(userService.updateProfilePicture(1, file)).rejects.toThrow(
        AppError
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating profile picture:",
        expect.any(Error)
      );
    });

    test("should handle errors from imageKit upload", async () => {
      const userId = 1;
      const file = { buffer: Buffer.from("file content") };

      const user = {
        id: userId,
        name: "John Doe",
        profile: { profilePictureId: "oldFileId", profilePicture: "oldUrl" },
      };
      prismaMock.user.findUnique.mockResolvedValue(user);

      imagekit.upload.mockRejectedValue(new Error("Upload error"));

      await expect(
        userService.updateProfilePicture(userId, file)
      ).rejects.toThrow(Error);
      expect(imagekit.deleteFile).toHaveBeenCalledWith("oldFileId");
      expect(console.error).toHaveBeenCalledWith(
        "Error updating profile picture:",
        expect.any(Error)
      );
    });
  });
});
