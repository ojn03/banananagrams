import { useContext } from "react";
import { GameModeContext } from "@/_components/providers/gameMode/context";

const useGameModeContext = () => {
  const context = useContext(GameModeContext);

  if (context === null) {
    throw Error("null game state");
  }

  return context;
};

export default useGameModeContext;
