import { addUserToRoom, createRoom, getRoomByRoomCode } from "@/db/transactions/room";
import { router, publicProcedure } from "@/trpc";
import { isString, validateAddUserToRoomInput, validateCreateRoomInput } from "@/validators";

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

export default roomRouter