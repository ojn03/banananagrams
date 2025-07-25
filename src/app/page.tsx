"use client";
import InfiniteGrid from "@/_components/grid";
import gameState from "@/_components/context";
import GameStateContext from "@/_components/context";
import { useState } from "react";
import { position } from "@/types";

export default function Home() {
  const [state, setState] = useState<Record<string, string>>({
    "2,2": "A",
    "1,1": "B",
  }); //TODO move to a subcomponent
  const moveTile = (oldPos: position, newPos: position) => {
    const oldPosString = `${oldPos.x / 50},${oldPos.y / 50}`;
    const newPosString = `${newPos.x / 50},${newPos.y / 50}`;

    const let1 = state[oldPosString];
    const let2 = state[newPosString];

    if (newPosString in state) {
      // swap tiles if new position is taken

      setState((prev) => {
        return { ...prev, oldPosString: let2, newPosString: let1 };
      });
    } else {
      //update new position and delete old
      setState((prev) => {
        delete prev[oldPosString];
        return { ...prev, newPosString: let1 };
      });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <GameStateContext.Provider value={{ state: state, moveTile }}>
        <InfiniteGrid />
      </GameStateContext.Provider>
    </div>
  );
}
