"use client";
import useGameModeContext from "@/hooks/gameMode";
import { useRouter } from "next/navigation";
//TODO create a color scheme

export default function Page() {
  const { setGameMode } = useGameModeContext();

  const router = useRouter();

  return (
    <div className="bg-neutral-300 flex flex-col h-full w-full justify-center items-center">
      <button
        onClick={() => {
          setGameMode("single");
          router.push("/game");
        }}
        className="bg-neutral-700 h-10 w-60 m-10 rounded-lg hover:cursor-pointer"
      >
        play alone
      </button>
      <button
        onClick={() => {
          setGameMode("multi");
          router.push("/game");
        }}
        className="bg-neutral-700 h-10 w-60 m-10 rounded-lg hover:cursor-pointer"
      >
        play with friends
      </button>
    </div>
  );
}
