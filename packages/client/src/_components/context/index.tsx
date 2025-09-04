"use client";

import type { DropData, GameMode, Position, TileInfo } from "@/types";
import { createContext, ReactNode } from "react";
import { CreateSinglePlayerContext } from "./singlePlayer";
import { CreateMultiplayerContext } from "./multiplayer";

//TODO toast notis for errors, peel, dump, etc
//TODO add multiselect
//MAYBE move to hooks file
//MAYBE move gamestatecontexttype to types file
export interface GameStateContextType {
  board: Record<string, TileInfo>;
  wallet: string[];
  bank: Record<string, number>;
  spacing: number;
  moveTile: (oldPos: Position, newPos: Position) => void;
  addTile: (letter: string, pos: Position) => void;
  removeTile: (gridPos: Position) => void;
  dump: (dto: DropData) => void;
  gameMode: GameMode;
  roomCode?: string;
  setRoomCode?: (code: string) => void;
}

export const GameStateContext = createContext<GameStateContextType | null>(
  null
);

interface props {
  children: ReactNode;
  gameMode: GameMode;
}

const TileProvider = ({ children, gameMode }: props) => {
  // const [roomCode, setRoomCode] = useState<string>();

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
