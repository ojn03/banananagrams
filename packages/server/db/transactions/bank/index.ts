import { Bank } from "@/types";
import { bankModel } from "@/db/schemas";
import { getRoomByRoomCode } from "@/db/transactions/room";
import defaultBank from "./defaultLetterDistribution";

function bankSize(bank: Bank) {
  let bankSize = 0;
  for (const letter in bank.vault) {
    bankSize += bank.vault[letter];
  }

  return bankSize;
}

export async function createNewBank(roomCode: string) {
  const room = await getRoomByRoomCode(roomCode);

  await bankModel.create({
    room: room._id,
    vault: defaultBank,
  });

  const newBank = await bankModel.findOne({ room: roomCode }).lean().orFail();

  return newBank;
}

export async function peel(roomCode: string) {
  const room = await getRoomByRoomCode(roomCode); //MAYBE have bank model store the room code instead

  const bank = await bankModel.findOne({ room: room._id }).orFail(() => {
    throw new Error(`Bank with room Id ${room._id} not found`);
  });

  const size = bankSize(bank);
  const numPlayers = room.users.length;

  if (numPlayers > size) {
    // do sum
  }

  // bank.vault// check if not enough letters // randomly withdraw letters and add it to each user
}
