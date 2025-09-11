"use client";

import type {
  BanananagramsSocket,
  DropData,
  Position,
  TileInfo,
  User,
} from "@/types";
import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { CreateSinglePlayerContext } from "./singlePlayer";
import { CreateMultiplayerContext } from "./multiplayer";
import useGameModeContext from "@/hooks/gameMode";
import { redirect } from "next/navigation";

//TODO toast notis for errors, peel, dump, etc
//TODO add multiselect
//MAYBE move to hooks file
//MAYBE move gamestatecontexttype to types file

interface MultiplayerStateType {
  roomCode: string;
  setRoomCode: (code: string) => void;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  setBank: (bank: Record<string, number>) => void;
  socket: BanananagramsSocket;
}

export interface GameStateContextType {
  board: Record<string, TileInfo>;
  wallet: string[];
  bank: Record<string, number>;
  spacing: number;
  moveTile: (oldPos: Position, newPos: Position) => void;
  addTile: (letter: string, pos: Position) => void;
  dump: (dto: DropData) => void;
  multiplayerState?: MultiplayerStateType;
}

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
