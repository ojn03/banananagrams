import {
  addUserToRoom,
  createRoom,
  getRoomByRoomCode,
  startGame,
} from "@/db/transactions/room";
import { router, publicProcedure } from "@/trpc";
import {
  isString,
  validateAddUserToRoomInput,
  validateCreateRoomInput,
} from "@/validators";
import { ioSocket } from "@/index";
import { TRPCError } from "@trpc/server";

const roomRouter = router({
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
    try {
      const room = await getRoomByRoomCode(roomCode);
      return room;
    } catch (err) {
      if (err instanceof TRPCError) {
        throw err;
      }
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
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

  startGame: publicProcedure.input(isString).mutation(async (opts) => {
    const { input: roomCode } = opts;

    const room = await startGame(roomCode);

    ioSocket.to(roomCode).emit("roomUpdated", room);

    return room;
  }),
});

export default roomRouter;
