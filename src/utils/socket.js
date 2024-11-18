import { Server } from "socket.io";

let io;

export const initializeSocket = (server, app) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  // Middleware to attach io instance in request object
  app.use((req, res, next) => {
    req.io = io;
    return next();
  });
};
