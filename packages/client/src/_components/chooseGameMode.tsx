"use client"
import { GameMode } from "@/types";
import { useState } from "react";
import TileProvider from "./context";

export function ChoooseGameMode({ children }: { children: React.ReactNode }) {
  const [gameMode, setGameMode] = useState<GameMode>();

  return gameMode === undefined ? (
    <div className="bg-neutral-300 flex flex-col h-full w-full justify-center items-center">
      <button
        onClick={() => setGameMode("multi")}
        className="bg-neutral-700 h-10 w-45 m-10 rounded-lg"
      >
        multiplayer
      </button>
      <button
        onClick={() => setGameMode("single")}
        className="bg-neutral-700 h-10 w-45 m-10 rounded-lg"
      >
        single player
      </button>
    </div>
  ) : (
    <TileProvider gameMode={gameMode}>{children}</TileProvider>
  );
}