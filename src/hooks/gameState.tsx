import { useContext } from "react";
import { GameStateContext } from "@/_components/context";

const useGameStateContext = () => {
  const context = useContext(GameStateContext);

  if (context === null) {
    throw Error("null game state");
  }

  return context;
};

export default useGameStateContext;
