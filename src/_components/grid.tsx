"use client";
import { useEffect, useState } from "react";
import useGameStateContext from "@/hooks/gameState";
import Tile from "./tile";
import { position } from "@/types";
import { closestMultiple, validateState } from "@/utils";

export default function InfiniteGrid({
  dictionary,
}: {
  dictionary: Set<string>;
}) {
  const { state, spacing, moveTile } = useGameStateContext();

  validateState(state, dictionary);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [pos, setPos] = useState<position>({ x: 0, y: 0 }); // grid pos

  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    setWindowSize({ width: window.screen.width, height: window.screen.height });
  }, []);

  // Generate horizontal lines separated by 100px
  // TODO use canvas instead to draw lines
  const horizontalLines = [];
  for (let y = pos.y % spacing; y < windowSize.height; y += spacing) {
    horizontalLines.push(
      <div
        key={y}
        style={{
          position: "fixed",
          top: y,
          left: 0,
          width: "100%",
          height: 1,
          background: "#ccc",
        }}
      />
    );
  }

  const verticalLines = [];
  for (let x = pos.x % spacing; x < windowSize.width; x += spacing) {
    verticalLines.push(
      <div
        key={x}
        style={{
          position: "fixed",
          top: 0,
          left: x,
          width: 1,
          height: "100%",
          background: "#ccc",
        }}
      />
    );
  }

  const tiles = [];

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const oldPosString = e.dataTransfer.getData("text/plain");
    const [oldX, oldY, oldMouseX, oldMouseY] = oldPosString
      .split(",")
      .map(Number);

    const oldPos = { x: oldX, y: oldY };

    // Calculate new position from mouse coordinates
    const mouseMoveX = e.clientX - oldMouseX;
    const mouseMoveY = e.clientY - oldMouseY;

    const newPos = {
      x: closestMultiple(oldX + mouseMoveX, spacing),
      y: closestMultiple(oldY + mouseMoveY, spacing),
    };

    moveTile(oldPos, newPos);
  };

  for (const key in state) {
    const [x, y] = key.split(",").map(Number);
    const tile = (
      <Tile
        gridPos={pos}
        absolutePosition={{ x: x * spacing, y: y * spacing }}
        info={state[key]}
        key={key}
        size={spacing}
      />
    );
    tiles.push(tile);
  }

  //enable panning the grid
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setPos((prev) => {
          return { x: prev.x + event.movementX, y: prev.y + event.movementY };
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDragDrop}
      onMouseDown={(e) => {
        // Only start grid dragging if we clicked on the container itself
        if (e.target === e.currentTarget) {
          setIsDragging(true);
        }
      }}
      className="h-full w-full bg-white text-black absolute cursor-grab active:cursor-grabbing"
    >
      {horizontalLines}
      {verticalLines}
      {tiles}
      <div className="fixed top-1 left-1 select-none">
        {pos.x},{pos.y}
      </div>
    </div>
  );
}
