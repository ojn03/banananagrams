import { Bank } from "@/types";
import { bankModel } from "@/db/schemas";
import { getRoomByRoomCode } from "@/db/transactions/room";
import defaultBank from "./defaultLetterDistribution";

function bankSize(bank: Bank) {
  let bankSize = 0;
  for (const count of bank.vault.values()) {
    bankSize += count;
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

  const bank = await findBankByRoomCode(roomCode);

  const size = bankSize(bank);
  const numPlayers = room.users.length;

  if (numPlayers > size) {
    // do sum
  }

  // Not enough letters to peel for all players
  return false;
}

export async function dump(
  roomCode: string,
  letter: string
): Promise<string[]> {
  const bank = await findBankByRoomCode(roomCode);

  if (bankSize(bank) < 3) {
    throw new Error("not enough letters left in bank");
  }

  const letters = withdraw(bank.room_code, 3, bank);
  bank.vault.set(letter, (bank.vault.get(letter) || 0) + 1);

  return letters;
}

async function findBankByRoomCode(roomCode: string) {
  const bank = await bankModel.findOne({ room_code: roomCode }).orFail(() => {
    throw new Error(`Bank with room code ${roomCode} not found`);
  });
  return bank;
}

export async function withdraw(
  roomCode: string,
  numLetters: number,
  existingBank: Bank | undefined = undefined
): Promise<string[]> {
  const bank =
    existingBank == undefined
      ? await findBankByRoomCode(roomCode)
      : existingBank;
  const availableLetters: string[] = [];
  let total = 0;

  Array.from(bank.vault.entries()).forEach(([k, v]) => {
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
    bank.vault.set(pick, bank.vault.get(pick)! - 1);
    // Swap with last and pop for O(1) removal
    availableLetters[idx] = availableLetters[availableLetters.length - 1];
    availableLetters.pop();
  }
  await bankModel.updateOne({ room_code: roomCode }, { vault: bank.vault });
  return picked;
}
