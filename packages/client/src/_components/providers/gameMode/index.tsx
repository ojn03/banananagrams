"use client";

import { GameMode } from "@/types";
import { useState } from "react";
import { GameModeContext } from "./context";

export default function GameModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gameMode, setGameMode] = useState<GameMode>();

  return (
    <GameModeContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </GameModeContext.Provider>
  );
}
