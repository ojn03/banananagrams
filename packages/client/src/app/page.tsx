"use client";
import useGameStateContext from "@/hooks/gameState";
import { redirect } from "next/navigation";
//TODO create a color scheme

export default function Page() {
  // redirect('/game')
  const { gameMode, roomCode, setRoomCode, player, setPlayer } =
    useGameStateContext();
  return <button onClick={() => redirect("/game")}>{gameMode}</button>;
}
