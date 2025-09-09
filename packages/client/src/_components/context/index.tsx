"use client";

import type { DropData, Position, TileInfo } from "@/types";
import { createContext, ReactNode } from "react";
import { CreateSinglePlayerContext } from "./singlePlayer";
import { CreateMultiplayerContext } from "./multiplayer";
import useGameModeContext from "@/hooks/gameMode";
import { redirect } from "next/navigation";

//TODO toast notis for errors, peel, dump, etc
//TODO add multiselect
//MAYBE move to hooks file
//MAYBE move gamestatecontexttype to types file
export interface GameStateContextType {
  board: Record<string, TileInfo>;
  wallet: string[];
  bank: Record<string, number>;
  setBank?: (bank: Record<string, number>) => void
  spacing: number;
  moveTile: (oldPos: Position, newPos: Position) => void;
  addTile: (letter: string, pos: Position) => void;
  // removeTile: (gridPos: Position) => void;
  dump: (dto: DropData) => void;
  roomCode?: string;
  setRoomCode?: (code: string) => void; //This is required for multiplayer context
  player: string; //TODO add id and name. default name to anonymous
  setPlayer: (player: string) => void;
  // TODO MultiplayerData?
}

export const GameStateContext = createContext<GameStateContextType | null>(
  null
);

interface props {
  children: ReactNode;
}

const TileProvider = ({ children }: props) => {
  const {  gameMode } = useGameModeContext();

  if (gameMode === undefined){
    redirect('/')
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
