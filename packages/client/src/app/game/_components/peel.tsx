"use client";

import useGameStateContext from "@/hooks/gameState";

export default function Peel() {
  const { peel } = useGameStateContext();

  return (
    <button onClick={peel} className="fixed bottom-5 right-1/2 w-75 translate-x-1/2 h-10 rounded-2xl bg-neutral-300 opacity-75">
      Peel (or press spacebar)
    </button>
  );
}
