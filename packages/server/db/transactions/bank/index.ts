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
  await getRoomByRoomCode(roomCode);
  await bankModel.create({
    room_code: roomCode,
    vault: defaultBank,
  });

  const newBank = await bankModel
    .findOne({ room_code: roomCode })
    .lean()
    .orFail();

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

  // Not enough letters to peel for all players
  return false;
}

export async function withdraw(
  roomCode: string,
  numLetters: number
): Promise<string[]> {
  const bank = await bankModel.findOne({ room_code: roomCode }).orFail(() => {
    throw new Error(`Bank with room code ${roomCode} not found`);
  });
  const availableLetters: string[] = [];
  let total = 0;
  Object.entries(bank.vault).forEach(([k, v]) => {
    for (let i = v; i > 0; i -= 1) availableLetters.push(k);

    total += v;
  });

  if (total < numLetters) {
    throw new Error("not enough letters in bank");
  }
  
  const picked: string[] = [];
  for (let i = 0; i < numLetters; i++) {
    const idx = Math.floor(Math.random() * availableLetters.length);
    const pick = availableLetters[idx];
    picked.push(pick);
    bank.vault[pick] -= 1;
    // Swap with last and pop for O(1) removal
    availableLetters[idx] = availableLetters[availableLetters.length - 1];
    availableLetters.pop();
  }
  await bank.save();
  return picked;
}
