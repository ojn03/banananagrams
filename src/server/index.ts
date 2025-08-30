import dotenv from "dotenv";
import { router, publicProcedure } from "./trpc";
import mongoose from "mongoose";
import { createUser, getUserById } from "./db/transactions/user";
import {
  isString,
  isValidOIDString,
  validateAddUserToRoomInput,
  validateCreateRoomInput,
} from "./validators";
import {
  addUserToRoom,
  getRoomByRoomCode,
  createRoom,
} from "./db/transactions/room";

dotenv.config();
const db_url = process.env.db_connection_string;

if (!db_url) {
  throw new Error("DB url is not defined");
}

mongoose.connect(db_url);

const appRouter = router({
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

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
