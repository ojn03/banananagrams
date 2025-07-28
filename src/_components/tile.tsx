"use client";
import { useRef } from "react";
import { position, tileInfo } from "@/types";
import useGameStateContext from "@/hooks/gameState";

interface props {
  // the current position of the grid
  gridPos: position;
  info: tileInfo;
  absolutePosition?: position;
  size?: number;
}

//TODO move useEffects to grid component

export default function Tile({
  gridPos,
  info,
  absolutePosition = { x: 100, y: 100 },
  size = 50,
}: props) {
  const { moveTile } = useGameStateContext();
  const dragRef = useRef<HTMLDivElement>(null);

  const screenPos = {
    x: absolutePosition.x + gridPos.x,
    y: absolutePosition.y + gridPos.y,
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const x = absolutePosition.x;
    const y = absolutePosition.y;
    e.dataTransfer.setData("text/plain", `${x},${y},${e.clientX},${e.clientY}`);
    e.dataTransfer.effectAllowed = 'move'
    if (dragRef.current) {
      dragRef.current.style.opacity = "0.5";
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const oldPosString = e.dataTransfer.getData("text/plain");

    const [x, y, ,] = oldPosString.split(",").map(Number);

    const oldPos = { x, y };

    moveTile(oldPos, absolutePosition);
  };

  const color =
    info.valid.horizontal || info.valid.vertical
      ? "bg-emerald-300"
      : "bg-gray-400";

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
        top: screenPos.y,
        left: screenPos.x,
        height: size,
        width: size,
      }}
      className={`rounded-xl flex justify-center items-center z-50 cursor-pointer select-none hover:scale-105 ${color}`}
    >
      {info.letter}
      {`V: ${info.valid.vertical}\n H: ${info.valid.horizontal}\n`}
      {screenPos.x},{screenPos.y}
    </div>
  );
}
