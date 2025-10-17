"use client";

import useGameStateContext from "@/hooks/gameState";
import { isSingleValidComponent } from "@/utils/gameUtils";

export default function Peel() {
  const { peel, board, wallet } = useGameStateContext();
  const canpeel = isSingleValidComponent(board) && wallet.length == 0;

  return (
    canpeel && (
      <button
        onClick={peel}
        className="fixed bottom-5 right-1/2 w-75 translate-x-1/2 h-10 rounded-2xl bg-emerald-500 opacity-75 hover:bg-emerald-600 cursor-pointer transition-colors duration-300 animate-bounce"
      >
        click here to peel (or press spacebar)
      </button>
    )
  );
}
