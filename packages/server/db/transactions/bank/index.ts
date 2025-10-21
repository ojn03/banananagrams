import { Bank } from "@/types";
import { bankModel } from "@/db/schemas";
import { getRoomByRoomCode } from "@/db/transactions/room";
import defaultBank from "./defaultLetterDistribution";
import { ioSocket } from "@/index";
import { getUserById } from "../user";
import { TRPCError } from "@trpc/server";

export async function sizeByRoomCode(roomCode: string) {
  const bank = await getBankByRoomCode(roomCode);
  return bankSize(bank);
}

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

  const newBank = await getBankByRoomCode(roomCode);

  return newBank;
}

export async function peel(roomCode: string, userID: string) {
  const sockets = await ioSocket.to(roomCode).fetchSockets();

  const bank = await getBankByRoomCode(roomCode);
  if (sockets.length > bankSize(bank)) {
    // this user won
    const user = await getUserById(userID);
    ioSocket.emit("userWon", user);
    return;
  }
  const letters = await withdraw(roomCode, sockets.length);

  sockets.forEach((sock, i) => {
    sock.emit("peelResponse", [letters[i]]);
  });

  return;
}

export async function dump(
  roomCode: string,
  letter: string
): Promise<string[]> {
  const bank = await getBankByRoomCode(roomCode);

  if (bankSize(bank) < 3) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Not enough letters left in bank",
    });
  }

  const letters = withdraw(bank.room_code, 3, bank);
  bank.vault.set(letter, (bank.vault.get(letter) || 0) + 1);
  bank.save();

  return letters;
}

async function getBankByRoomCode(roomCode: string) {
  const bank = await bankModel.findOne({ room_code: roomCode }).orFail(() => {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Bank with room code ${roomCode} not found`,
    });
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
      ? await getBankByRoomCode(roomCode)
      : existingBank;
  const availableLetters: string[] = [];
  let total = 0;

  Array.from(bank.vault.entries()).forEach(([k, v]) => {
    for (let i = v; i > 0; i -= 1) availableLetters.push(k);

    total += v;
  });

  if (total < numLetters) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Not enough letters in bank",
    });
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
