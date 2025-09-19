"use client";

import type { GameStateContextType } from "@/types";
import { createContext, ReactNode } from "react";
import { CreateSinglePlayerContext } from "./singlePlayerContext";
import { CreateMultiplayerContext } from "./multiplayerContext";
import useGameModeContext from "@/hooks/gameMode";
import { redirect } from "next/navigation";

export const GameStateContext = createContext<GameStateContextType | null>(
  null
);

interface props {
  children: ReactNode;
}

const TileProvider = ({ children }: props) => {
  const { gameMode } = useGameModeContext();

  if (gameMode === undefined) {
    redirect("/");
  }

  const gameContext =
    gameMode === "single"
      ? CreateSinglePlayerContext()
      : CreateMultiplayerContext();

  return (
    <GameStateContext.Provider value={{ ...gameContext }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default TileProvider;
