import { useContext } from "react";
import { GameModeContext } from "@/_components/context/gameMode";

const useGameModeContext = () => {
  const context = useContext(GameModeContext);

  if (context === null) {
    throw Error("null game state");
  }

  return context;
};

export default useGameModeContext;
