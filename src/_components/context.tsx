import { position } from "@/types";
import { createContext } from "react";

interface gameStateContextType {
  moveTile: (oldPos: position, newPos: position) => void;

  state: Record<string, string>;

  // addTile: (pos: position) => void;
}

const GameStateContext = createContext<gameStateContextType | null>(null);

export default GameStateContext;
