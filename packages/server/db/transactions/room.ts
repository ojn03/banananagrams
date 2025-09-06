import { roomModel } from "@/db/schemas";
import { getUserById } from "@/db/transactions/user";

//MAYBE implement atomic transactions

export async function createRoom(roomName: string, userId: string) {
  const room_code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  //ensure user exists
  await getUserById(userId);

  await roomModel.create({
    name: roomName,
    users: [userId],
    room_code,
  });

  const room = await getRoomByRoomCode(room_code);

  return room;
}

export async function getRoomByRoomCode(roomCode: string) {
  const room = await roomModel
    .findOne({ room_code: roomCode })
    .populate("users")
    .lean()
    .orFail(() => {
      throw new Error(`Room with code ${roomCode} not found`);
    });

  return room;
}

export async function addUserToRoom(userId: string, roomCode: string) {
  //ensure user exists
  await getUserById(userId);

  const room = await roomModel
    .findOneAndUpdate(
      { room_code: roomCode },
      { $addToSet: { users: userId } },
      { new: true }
    )
    .populate("users")
    .lean()
    .orFail(() => {
      throw new Error(`Room with code ${roomCode} not found`);
    });
  return room;
}
