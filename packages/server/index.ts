import { router, publicProcedure, createContext } from "@/trpc";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { bankRouter, userRouter, roomRouter } from "./routers";
import { BanananagramsSocket } from "./types";
import { Server } from "socket.io";

dotenv.config();

export type AppRouter = typeof appRouter;

const db_url = process.env.DB_CONNECTION_STRING;

if (!db_url) {
  throw new Error("DB url is not defined");
}

//TODO update mongodb allowed ips
mongoose.connect(db_url);
console.log("successfully connected to mongodb");

const appRouter = router({
  hello: publicProcedure.query(() => "hello from server"),
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

const io: BanananagramsSocket = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("a user has connected with socket id", socket.id);
  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Perform cleanup or update user counts here
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    mongoose.disconnect();
    console.log("Server closed.");
    process.exit(0);
  });
  io.close();
});

server.listen(port);
console.log(`app listening on port ${port}`);
