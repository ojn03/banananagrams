"use client";
import { useEffect, useState } from "react";
import useGameStateContext from "@/hooks/gameState";
import Tile from "./tile";
import { Position } from "@/types";
import { validateBoard } from "@/utils/gameUtils";
import Dump from "../dump";
import GridCanvas from "./canvas";
import Peel from "../peel";

export default function InfiniteGrid({
  dictionary,
}: {
  dictionary: Set<string>;
}) {
  const { board, spacing, addTile, moveTile, peel } = useGameStateContext();

  validateBoard(board, dictionary);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [pos, setPos] = useState<Position>({ x: 0, y: 0 }); // grid pos

  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    setWindowSize({ width: window.screen.width, height: window.screen.height });
  }, []);

  // TODO enable mobile dragging
  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const dtoString = e.dataTransfer.getData("application/json");

    const dto = JSON.parse(dtoString);
    const dropData = dto["data"];

    switch (dto["type"]) {
      case "wallet":
        const { letter, x, y, mouseX, mouseY } = dropData;

        const movementx = e.clientX - mouseX;
        const movementy = e.clientY - mouseY;

        const newp = new Position(
          Math.round((x + movementx + pos.x) / spacing),
          Math.round((y + movementy + pos.y - spacing * 1.5) / spacing) // FIXME New Y is based on hardcoded height of wallet
        );

        addTile(letter, newp);
        break;
      case "tile":
        const {
          x: oldX,
          y: oldY,
          clientX: oldMouseX,
          clientY: oldMouseY,
        } = dropData;

        const oldPos = { x: oldX, y: oldY };

        // Calculate new position from mouse coordinates
        const mouseMoveX = e.clientX - oldMouseX;
        const mouseMoveY = e.clientY - oldMouseY;

        const newPos = {
          x: Math.round(oldX + mouseMoveX / spacing),
          y: Math.round(oldY + mouseMoveY / spacing),
        };

        moveTile(oldPos, newPos);
        break;
      default:
        console.error("Unknown drop type:", dto.type);
    }
  };

  const tiles = [];

  for (const key in board) {
    const [x, y] = key.split(",").map(Number);
    const tile = (
      <Tile
        gridPos={pos}
        absolutePosition={{ x, y }}
        info={board[key]}
        key={key}
        size={spacing}
      />
    );
    tiles.push(tile);
  }

  // enable panning the grid
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setPos((prev) => {
          return { x: prev.x - event.movementX, y: prev.y - event.movementY };
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

  // peel when space is pressed
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent page scroll
        peel();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [peel]);

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
      className="h-full w-full bg-white text-black relative cursor-grab active:cursor-grabbing"
    >
      <GridCanvas pos={pos} spacing={spacing} windowSize={windowSize} />

      {tiles}
      <div className="absolute top-1 left-1 select-none">
        {pos.x},{pos.y}
        <Dump />
        <Peel />
      </div>
    </div>
  );
}
