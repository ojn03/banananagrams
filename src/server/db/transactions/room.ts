import { room } from "@/server/types";
import { roomModel } from "../schemas";
import { getUserById } from "./user";

export async function createRoom(roomName: string, userId: string) {
  const room_code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  //ensure user exists
  await getUserById(userId);

  const room: room = await roomModel
    .create({
      name: roomName,
      users: [userId],
      room_code,
    })
    .then((item) => {
      return item.populate("users");
    });

  return room;
}

async function getRoomByRoomCode(room_code: string): Promise<room> {
  const room: room = await roomModel
    .findOne({ room_code })
    .populate("users")
    .orFail();

  return room;
}

export async function addUserToRoom(userId: string, roomCode: string) {
  //ensure user exists
  await getUserById(userId);

  const room = await roomModel
    .findOneAndUpdate(
      { room_code: roomCode },
      { $push: { users: userId } },
      { new: true }
    )
    .orFail()
    .populate("users");

  return room;
}
