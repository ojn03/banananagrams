import { Position, TileInfo, User } from "@/types";
import { GameStateContextType } from ".";
import { useState } from "react";

// export interface GameStateContextType {
//   board: Record<string, TileInfo>;
//   wallet: string[];
//   bank: Record<string, number>;
//   spacing: number;
//   moveTile: (oldPos: Position, newPos: Position) => void;
//   addTile: (letter: string, pos: Position) => void;
//   removeTile: (gridPos: Position) => void;
//   dump: (dto: DropData) => void;
//   roomCode?: string;
//   setRoomCode?: (code: string) => void; //This is required for multiplayer context
//   player: string;
//   setPlayer: (player: string) => void;
// }

export function CreateMultiplayerContext(): GameStateContextType {
  const initialWithDrawal = ["a", "b", "c"]; // TODO tpc.bank.withdrawal
  const [wallet, setWallet] = useState<string[]>(initialWithDrawal); // MAYBE make wallet a map kinda like bank
  const [board, setBoard] = useState<Record<string, TileInfo>>({});
  const [user, setUser] = useState<User>({ name: "", id: "" });
  const [roomCode, setRoomCode] = useState<string>("");

  const moveTile = (oldPos: Position, newPos: Position) => {
    const prevPositionString = `${oldPos.x},${oldPos.y}`;
    const targetPositionString = `${newPos.x},${newPos.y}`;

    if (targetPositionString === prevPositionString) return;

    setBoard((prev) => {
      const newState = { ...prev };

      if (targetPositionString in newState) {
        // Target position is occupied, swap the tiles
        const temp = newState[prevPositionString];
        newState[prevPositionString] = newState[targetPositionString];
        newState[targetPositionString] = temp;
      } else {
        // Target position is empty, just move the tile
        newState[targetPositionString] = newState[prevPositionString];
        delete newState[prevPositionString];
      }

      return newState;
    });
  };

  //Adds a tile from wallet to board
  const addTile = (letter: string, gridPos: Position) => {
    //TODO enable swapping grid and wallet tiles
    if (wallet.includes(letter) && !(gridPos.toString() in board)) {
      setBoard((prev) => {
        return {
          ...prev,
          [gridPos.toString()]: {
            letter,
            valid: {
              vertical: true,
              horizontal: true,
            },
          },
        };
      });
      setWallet((prev) => {
        const prevIndex = prev.findIndex((l) => l == letter);
        return prev.filter((_, index) => index !== prevIndex);
      });
    } else {
      //TODO Toast
      console.error("letter " + letter + " does not exist in wallet");
    }
  };

  return {
    spacing: 50,
    board,
    moveTile,
    addTile,
    wallet,

    multiplayerState: { user, setUser, roomCode, setRoomCode },
  } as any; //eslint-disable-line
}
