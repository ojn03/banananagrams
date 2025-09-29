import { router, publicProcedure, createContext } from "@/trpc";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { bankRouter, userRouter, roomRouter } from "./routers";
import { BanananagramsSocket } from "./types";
import { Server } from "socket.io";
import { addUserToRoom } from "./db/transactions/room";
import { peel } from "./db/transactions/bank";
import { TRPCError } from "@trpc/server";

dotenv.config();

export type AppRouter = typeof appRouter;

const db_url = process.env.DB_CONNECTION_STRING;

if (!db_url) {
  throw new Error("DB url is not defined");
}

mongoose.connect(db_url);
console.log("successfully connected to mongodb");

const appRouter = router({
  error: publicProcedure.query(() => {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }),
  hello: publicProcedure.query(async () => {
    return "hello from server";
  }),
  bank: bankRouter,
  user: userRouter,
  room: roomRouter,
});

const port = process.env.PORT || "3001";
const server = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
});

export const ioSocket: BanananagramsSocket = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" },
});

// MAYBE store user data in socket.data
ioSocket.on("connection", (socket) => {
  console.log("a user has connected with socket id", socket.id);
  socket.on("joinRoom", async ({ roomCode, user }) => {
    socket.join(roomCode);
    try {
      const room = await addUserToRoom(user, roomCode);
      ioSocket.to(roomCode).emit("roomUpdated", room);
    } catch (error) {
      socket.emit(
        "error",
        new Error("error adding user to room. double check room number")
      );
    }
  });

  socket.on("peel", async (payload) => {
    try {
      await peel(payload.roomCode, payload.user);
    } catch (error) {
      socket.emit("error", new Error("error peeling"));
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    mongoose.disconnect();
    console.log("Server closed.");
    process.exit(0);
  });
  ioSocket.close();
});

server.listen(port);
console.log(`app listening on port ${port}`);
