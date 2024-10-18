import prisma from "../utils/prisma.js";

class UserService {
  // Create a new user
  async createUser(payload) {
    try {
      const { name, email, password, identity_type, identity_number, address } =
        payload;

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          profile: {
            create: {
              identity_type,
              identity_number,
              address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return newUser; // Return the created user
    } catch (error) {
      console.error("Error creating user:", error); // Log error for debugging
      throw new Error("Error creating user"); // Throw a user-friendly error
    }
  }

  // Fetch all users
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Error fetching users");
    }
  }

  // Fetch a single user by ID
  async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          profile: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(`Error fetching user with ID ${id}`);
    }
  }

  // Update a user by ID
  async updateUser(id, payload) {
    try {
      const { name, email, password, identity_type, identity_number, address } =
        payload;

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name,
          email,
          password,
          profile: {
            update: {
              identity_type,
              identity_number,
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
      throw new Error(`Error updating user with ID ${id}`);
    }
  }

  // Delete a user by ID
  async deleteUser(id) {
    try {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(`Error deleting user with ID ${id}`);
    }
  }
}

export default UserService;
