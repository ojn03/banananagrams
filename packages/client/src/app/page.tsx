"use client";
import useGameModeContext from "@/hooks/gameMode";
import { GameMode } from "@/types";
import { useRouter } from "next/navigation";
//TODO create a color scheme

export default function Page() {
  const { setMode } = useGameModeContext();
  return <SelectMode setGameMode={setMode} />;
}

function SelectMode({
  setGameMode,
}: {
  setGameMode: (mode: GameMode) => void;
}) {
  const router = useRouter();

  return (
    <div className="bg-neutral-300 flex flex-col h-full w-full justify-center items-center">
      <button
        onClick={() => {
          setGameMode("multi");
          router.push("/game");
        }}
        className="bg-neutral-700 h-10 w-60 m-10 rounded-lg hover:cursor-pointer"
      >
        multiplayer - es no work
      </button>
      <button
        onClick={() => {
          setGameMode("single");
          router.push("/game");
        }}
        className="bg-neutral-700 h-10 w-60 m-10 rounded-lg hover:cursor-pointer"
      >
        single player
      </button>
    </div>
  );
}
