import prisma from "../utils/prisma.js";
import AppError from "../utils/AppError.js";

class UserService {
  constructor() {
    this.prisma = prisma;
  }

  // Fetch all users
  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          profile: true,
        },
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Fetch a single user by ID
  async getUserById(id) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          profile: true,
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Update a user by ID
  async updateUser(id, payload) {
    try {
      const { name, email, address } = payload;

      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name,
          email,
          profile: {
            update: {
              address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Delete a user by ID
  async deleteUser(id) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      await this.prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export default UserService;
