"use client";
import InfiniteGrid from "@/_components/grid";
import GameStateContext from "@/_components/context";
import { useState } from "react";
import { position } from "@/types";

export default function Home() {
  const [state, setState] = useState<Record<string, string>>({
    "2,2": "A",
    "1,1": "B",
  }); //TODO move to a subcomponent
  const moveTile = (oldPos: position, newPos: position) => {
    const prevPositionString = `${oldPos.x / 50},${oldPos.y / 50}`;
    const targetPositionString = `${newPos.x / 50},${newPos.y / 50}`;

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
    <div className="h-screen w-screen overflow-hidden">
      <GameStateContext.Provider value={{ state, moveTile }}>
        <InfiniteGrid />
      </GameStateContext.Provider>
    </div>
  );
}
