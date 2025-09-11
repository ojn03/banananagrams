import { GameMode } from "@/types";
import { createContext } from "react";

interface gameModeContextType {
  gameMode : GameMode 
  setMode: (gameMode : GameMode) => void
}

export const GameModeContext = createContext<gameModeContextType | null>(
  null
);