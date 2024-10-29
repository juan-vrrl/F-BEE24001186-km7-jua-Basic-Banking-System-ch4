import prisma from "../utils/prisma.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class AuthService {
  constructor() {
    this.prisma = prisma;
  }

  // Login user
  async loginUser(payload) {
    try {
      const { email, password } = payload;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Invalid email or password", 401);
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { token, user };
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  // Create a new user
  async createUser(payload) {
    try {
      const { name, email, password, identityType, identityNumber, address } =
        payload;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          profile: {
            create: {
              identityType,
              identityNumber,
              address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(`A user with the email ${payload.email} already exists.`, 409);
      }
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default AuthService;
