"use client";

import { position, tileInfo } from "@/types";
import { createContext, ReactNode, useState } from "react";
import letters from "@/defaultLetters";
import { bankWithdrawal } from "@/utils";

interface gameStateContextType {
  state: Record<string, tileInfo>; //TODO rename to boardState
  wallet: string[];
  bank: Record<string, number>;
  spacing: number;
  moveTile: (oldPos: position, newPos: position) => void;
  // addTile: (pos: position) => void;
}

export const GameStateContext = createContext<gameStateContextType | null>(
  null
);

const TileProvider = ({ children }: { children: ReactNode }) => {
  const spacing = 75;
  const [bank, setBank] = useState<Record<string, number>>(letters);

  const [state, setState] = useState<Record<string, tileInfo>>({
    "2,2": {
      letter: "A",
      valid: {
        vertical: true,
        horizontal: true,
      },
    },
    "1,1": {
      letter: "B",
      valid: {
        vertical: true,
        horizontal: true,
      },
    },
    "3,3": {
      letter: "B",
      valid: {
        vertical: true,
        horizontal: true,
      },
    },
    "0,0": {
      letter: "X",
      valid: {
        vertical: true,
        horizontal: true,
      },
    },
  });

  const moveTile = (oldPos: position, newPos: position) => {
    const prevPositionString = `${oldPos.x / spacing},${oldPos.y / spacing}`;
    const targetPositionString = `${newPos.x / spacing},${newPos.y / spacing}`;

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

  return (
    <GameStateContext.Provider
      value={{ state, moveTile, spacing, bank, wallet: [] }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default TileProvider;
