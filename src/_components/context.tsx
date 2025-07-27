"use client";

import { position } from "@/types";
import { createContext, ReactNode, useState } from "react";

interface gameStateContextType {
  state: Record<string, string>;
  spacing: number;
  
  moveTile: (oldPos: position, newPos: position) => void;
  // addTile: (pos: position) => void;
}

export const GameStateContext = createContext<gameStateContextType | null>(
  null
);

const TileProvider = ({ children }: { children: ReactNode }) => {
  const spacing = 75;

  const [state, setState] = useState<Record<string, string>>({
    "2,2": "A",
    "1,1": "B",
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
    <GameStateContext.Provider value={{ state, moveTile, spacing }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default TileProvider;
