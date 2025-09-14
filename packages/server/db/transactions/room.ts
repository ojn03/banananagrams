import { roomModel } from "@/db/schemas";
import { getUserById } from "@/db/transactions/user";
import { ioSocket } from "@/index";
import { withdraw } from "./bank";

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
    host: userId,
    room_code,
  });

  const room = await getRoomByRoomCode(room_code);

  return room;
}

export async function startGame(roomCode: string) {
  const room = await roomModel
    .findOneAndUpdate(
      { room_code: roomCode },
      { hasBegun: true },
      { new: true }
    )
    .populate("users")
    .lean()
    .orFail(() => {
      throw new Error(`Room with code ${roomCode} not found`);
    });

  await distribute(roomCode);
  return room;
}

async function distribute(roomCode: string) {
  // TODO Distribute tiles to each player
  const roomSockets = await ioSocket.in(roomCode).fetchSockets();
  const numUsers = roomSockets.length;
  let numLetters: number;

  switch (true) {
    // case numUsers < 2:
    //   // TODO error
    //   break;
    case numUsers >= 1 && numUsers <= 4:
      numLetters = 21;
      break;
    case numUsers >= 5 && numUsers <= 6:
      numLetters = 15;
      break;
    case numUsers >= 7 && numUsers <= 8:
      numLetters = 11;
      break;
    default:
      //error
      break;
  }

  roomSockets.forEach(async (sock) => {
    const letters = await withdraw(roomCode, numLetters);
    sock.emit("addLetters", letters);
  });
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
