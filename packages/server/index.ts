import { router, publicProcedure, createContext } from "@/trpc";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { createUser, getUserById } from "@/db/transactions/user";
import {
  isString,
  isValidOIDString,
  validateAddUserToRoomInput,
  validateCreateRoomInput,
} from "@/validators";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

import {
  addUserToRoom,
  getRoomByRoomCode,
  createRoom,
} from "@/db/transactions/room";

dotenv.config();
// Export router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const db_url = process.env.DB_CONNECTION_STRING;

if (!db_url) {
  throw new Error("DB url is not defined");
}

mongoose.connect(db_url);
console.log("successfully connected to mongodb");

//TODO separate routes
const appRouter = router({
  hello: publicProcedure.query(() => "hello from client"),
  getUserById: publicProcedure.input(isValidOIDString).query(async (opts) => {
    const { input: userId } = opts;
    const user = await getUserById(userId);
    return user;
  }),

  createUser: publicProcedure.input(isString).mutation(async (opts) => {
    const { input: name } = opts;
    const createdUser = await createUser(name);
    return createdUser;
  }),

  addUserToRoom: publicProcedure
    .input(validateAddUserToRoomInput)
    .mutation(async (opts) => {
      const {
        input: { roomCode, userId },
      } = opts;

      const newRoom = await addUserToRoom(userId, roomCode);
      return newRoom;
    }),

  getRoomByCode: publicProcedure.input(isString).query(async (opts) => {
    const { input: roomCode } = opts;
    const room = await getRoomByRoomCode(roomCode);
    return room;
  }),

  createRoom: publicProcedure
    .input(validateCreateRoomInput)
    .mutation(async (opts) => {
      const {
        input: { roomName, userId },
      } = opts;

      const newRoom = await createRoom(roomName, userId);
      return newRoom;
    }),
});

createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Your client URL
    credentials: true, // Important for cookies/auth
  }),
}).listen(process.env.PORT || 3001);
