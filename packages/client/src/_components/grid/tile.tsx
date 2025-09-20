"use client";
import { useRef } from "react";
import { Position, TileDropData, TileInfo } from "@/types";
import useGameStateContext from "@/hooks/gameState";
import { isValidTile } from "@/utils/gameUtils";

interface props {
  // the current position of the grid
  gridPos: Position;
  info: TileInfo;
  absolutePosition: Position;
  size?: number;
}

export default function Tile({
  gridPos,
  info,
  absolutePosition,
  size = 50,
}: props) {
  const { moveTile, board } = useGameStateContext();
  const dragRef = useRef<HTMLDivElement>(null);

  const screenPos = {
    x: absolutePosition.x * size - gridPos.x,
    y: absolutePosition.y * size - gridPos.y,
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const x = absolutePosition.x;
    const y = absolutePosition.y;
    const dto: TileDropData = {
      type: "tile",
      data: {
        x,
        y,
        clientX: e.clientX,
        clientY: e.clientY,
        letter: info.letter,
      },
    };

    e.dataTransfer.setData("application/json", JSON.stringify(dto));
    e.dataTransfer.effectAllowed = "move";
    if (dragRef.current) {
      dragRef.current.style.opacity = "0.5";
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const dtoString = e.dataTransfer.getData("application/json");
    const dto = JSON.parse(dtoString);
    const dropData = dto["data"];
    switch (dto["type"]) {
      case "tile":
        // Handle tile movement from between tiles
        const { x, y } = dropData;
        moveTile(
          { x, y },
          { x: absolutePosition.x, y: absolutePosition.y }
        );
        break;
      case "wallet":
        // Handle tile placement from wallet onto existing grid tile

        console.error("cannot drop wallet tile onto existing tile", dto);
        break;
      default:
        // Handle unknown types or fallback
        console.error("Unknown drop type:", dto.type);
        break;
    }
  };

  const color = !isValidTile(
    board,
    `${absolutePosition.x },${absolutePosition.y }`
  )
    ? "bg-gray-300" // word is invalid
    : info.valid.horizontal && info.valid.vertical
    ? "bg-emerald-700" // word is valid both ways
    : "bg-emerald-400"; // word is only valid one way

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDragDrop}
      onDragEnd={() => {
        if (dragRef.current) dragRef.current.style.opacity = "1";
      }}
      style={{
        position: "absolute",
        top: screenPos.y + size * 0.05,
        left: screenPos.x + size * 0.05,
        height: size * 0.9,
        width: size * 0.9,
      }}
      className={`rounded-lg flex justify-center items-center cursor-pointer select-none hover:scale-105 ${color}`}
    >
      {info.letter}
    </div>
  );
}
