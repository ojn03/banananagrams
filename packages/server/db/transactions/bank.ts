import { Bank } from "@/types";
import { bankModel } from "@/db/schemas";
import { getRoomByRoomCode } from "@/db/transactions/room";

function bankSize(bank: Bank) {
  let bankSize = 0;
  for (const letter in bank.vault) {
    bankSize += bank.vault[letter];
  }

  return bankSize;
}

export async function peel(roomCode: string) {
  const room = await getRoomByRoomCode(roomCode);

  const bank = await bankModel.findOne({ room: room._id }).orFail();

  const size = bankSize(bank)
  const numPlayers = room.users.length;

  if ( numPlayers > size){
    // do sum
  }

  // bank.vault// check if not enough letters // randomly withdraw letters and add it to each user

 
}
