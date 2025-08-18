"use client";

import { Position, tileInfo } from "@/types";
import { createContext, ReactNode, useState } from "react";
import letters from "@/defaultLetters";
import { bankWithdrawal } from "@/utils";

interface gameStateContextType {
  state: Record<string, tileInfo>; //TODO rename to boardState
  wallet: string[];
  bank: Record<string, number>;
  spacing: number;
  moveTile: (oldPos: Position, newPos: Position) => void;
  addTile: (letter: string, pos: Position) => void;
  removeTile: (gridPos: Position) => void;
}

export const GameStateContext = createContext<gameStateContextType | null>(
  null
);

const TileProvider = ({ children }: { children: ReactNode }) => {
  const spacing = 50;
  const initBank = structuredClone(letters);
  const initialWithDrawal = bankWithdrawal(initBank, 15);
  const [wallet, setWallet] = useState<string[]>(initialWithDrawal); // MAYBE make wallet a map kinda like bank
  const [bank, setBank] = useState<Record<string, number>>(initBank);

  // TODO make a state class
  // MAYBE give each tile its own unique ID. Maybe uuid or LetternNumber. So we can delete and add specific tiles
  const [state, setState] = useState<Record<string, tileInfo>>({});

  const moveTile = (oldPos: Position, newPos: Position) => {
    const prevPositionString = `${oldPos.x / spacing},${oldPos.y / spacing}`;
    const targetPositionString = `${newPos.x},${newPos.y}`;

    if (targetPositionString === prevPositionString) return;

    setState((prev) => {
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

  const addTile = (letter: string, gridPos: Position) => {
    //TODO enable swapping grid and wallet tiles
    if (wallet.includes(letter) && !(gridPos.toString() in state)) {
      setState((prev) => {
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
      //MAYBE throw an error here
      console.error("letter " + letter + " does not exist in wallet");
    }
  };

  const removeTile = (gridPos: Position) => {
    if (!(gridPos.toString() in state)) {
      //TODO better user flow. we dont j want to crash the game
      throw new Error("Cannot remove a tile that does not exist");
    }

    const stateInfo = state[gridPos.toString()];

    setState((prev) => {
      const newState = { ...prev };
      delete newState[gridPos.toString()];
      return newState;
    });

    setWallet((prev) => {
      prev.push(stateInfo.letter);
      return prev;
    });
  };

  return (
    <GameStateContext.Provider
      value={{ state, spacing, bank, wallet, addTile, removeTile, moveTile }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default TileProvider;
