import { GameMode } from "@/types";
import { createContext } from "react";

interface gameModeContextType {
  gameMode? : GameMode 
  setMode: (gameMode : GameMode) => void
}

//TODO rename to game "settings" (and include PlayerName, roomCode, etc) 
export const GameModeContext = createContext<gameModeContextType | null>(
  null
);