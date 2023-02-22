import express from "express";
import redis from "redis";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
import rootRoute from "./routes/rootRoute.js";
import connectDB from "./config/db.js";

///////////////////////////////////////start-mongodb-mongoose-connection-code/////////////////////////////////////////////////////////////////////////
connectDB();
///////////////////////////////////////end-mongodb-mongoose-connection-code/////////////////////////////////////////////////////////////////

/// express server configuration
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

// Create a Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error(`Redis error: ${err}`);
});

app.use(express.json());
// Body parser
app.use(express.urlencoded({ extended: true }));

// handle chat messages
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    redisClient.sadd(roomId, userId);
  });

  socket.on("leave-room", (roomId, userId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
    redisClient.srem(roomId, userId);
  });

  socket.on("send-message", (roomId, message, sender) => {
    console.log(`Message received from ${sender}: ${message}`);
    io.to(roomId).emit("receive-message", message, sender);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", rootRoute);
app.use(notFound);
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
httpServer.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
