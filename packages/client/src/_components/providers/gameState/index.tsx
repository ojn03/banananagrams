"use client";

import type { GameStateContextType } from "@/types";
import { createContext, ReactNode } from "react";
import { CreateSinglePlayerContext } from "./singlePlayerContext";
import { CreateMultiplayerContext } from "./multiplayerContext";
import useGameModeContext from "@/hooks/gameMode";
import { redirect } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { ChooseName } from "./multiplayerSetup/chooseName";
import { JoinOrCreateRoom } from "./multiplayerSetup/joinOrCreateGame";
import { WaitingRoom } from "./multiplayerSetup/waitingRoom";
import Loading from "./multiplayerSetup/loading";

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

  if (gameMode === "single")
    return (
      <GameStateContext.Provider value={{ ...gameContext }}>
        {children}
      </GameStateContext.Provider>
    );

  const { multiplayerState } = gameContext;

  if (multiplayerState === undefined) {
    throw new Error("multiplayer state not defined");
  }

  const { isLoading } = trpc.hello.useQuery();

  const {
    user,
    room: { room_code, hasBegun },
    setUser,
  } = multiplayerState;

  return isLoading ? (
    <Loading />
  ) : !(user._id && user.name) ? (
    <ChooseName setUser={setUser} />
  ) : room_code === "" ? (
    <JoinOrCreateRoom state={multiplayerState} />
  ) : !hasBegun ? (
    <WaitingRoom state={multiplayerState} />
  ) : (
    <GameStateContext.Provider value={{ ...gameContext }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default TileProvider;
