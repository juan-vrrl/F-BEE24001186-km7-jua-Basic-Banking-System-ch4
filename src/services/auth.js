import prisma from "../utils/prisma.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

class AuthService {
  constructor() {
    this.prisma = prisma;
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
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
      console.error("Error creating user:", error);
      if (error.code === "P2002") {
        throw new AppError(
          `A user with the email ${payload.email} already exists.`,
          409
        );
      }
      throw error;
    }
  }

  // Forgot Password
  async forgotPassword(email) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        throw new AppError("No user found with this email", 404);
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });
  
      const resetLink = `http://${process.env.APP_URL}/reset-password?token=${token}`;
  
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`,
      });
  
      return { message: "Password reset link sent to your email" };
    } catch (error) {
      console.error("Error during password reset process:", error);
      throw error;
    }
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: "Password successfully reset" };
    } catch (error) {
      console.error("Error when resetting password:", error);
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "Token expired. Please request a new password reset link.",
          400
        );
      }
      if (error.name === "JsonWebTokenError") {
        throw new AppError("Invalid token.", 400);
      }
      throw error;
    }
  }
}

export default AuthService;
