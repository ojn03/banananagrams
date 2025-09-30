"use client";
import { WalletDropData } from "@/types";

// MAYBE make abstract grid and wallet tile together
export function WalletTile({ letter, spacing }: { letter: string; spacing: number; }) {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const dto: WalletDropData = {
      type: "wallet",
      data: {
        letter,
        x: rect.x,
        y: rect.y,
        mouseX: event.clientX,
        mouseY: event.clientY,
      },
    };

    event.dataTransfer.setData("application/json", JSON.stringify(dto));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      className="bg-gray-400  rounded-lg shadow-lg flex justify-center items-center select-none"
      style={{
        height: spacing,
        width: spacing,
      }}
    >
      {letter}
    </div>
  );
}
