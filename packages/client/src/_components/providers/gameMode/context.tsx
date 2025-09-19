import { GameMode } from "@/types";
import { createContext } from "react";

interface gameModeContextType {
  gameMode?: GameMode;
  setGameMode: (gameMode: GameMode) => void;
}

export const GameModeContext = createContext<gameModeContextType | null>(null);
