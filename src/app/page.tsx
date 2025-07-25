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
    const oldPosString = `${oldPos.x / 50},${oldPos.y / 50}`;
    const newPosString = `${newPos.x / 50},${newPos.y / 50}`;

    if (newPosString === oldPosString) return;

    const let1 = state[oldPosString];

    if (newPosString in state) {
      const let2 = state[newPosString];
      console.log(
        `Swapping ${let1} at ${oldPosString} with ${let2} at ${newPosString}`
      );

      // swap tiles if new position is taken
      setState((prev) => {
        const newState = { ...prev };
        newState[oldPosString] = let2;
        newState[newPosString] = let1;
        return newState;
      });
    } else {
      //update new position and delete old
      console.log(`Moving ${let1} from ${oldPosString} to ${newPosString}`);
      setState((prev) => {
        const newState = { ...prev };
        delete newState[oldPosString];
        newState[newPosString] = let1;
        return newState;
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
