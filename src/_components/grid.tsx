"use client";
import { useEffect, useState } from "react";
import useGameStateContext from "@/hooks/gameState";
import Tile from "./tile";
import { position } from "@/types";

export default function InfiniteGrid() {
  const { state } = useGameStateContext();
  const space = 50;
  const [windowH, setWindowH] = useState<number>(0);
  const [windowW, setWindowW] = useState<number>(0);

  const [pos, setPos] = useState<position>({ x: 0, y: 0 }); // grid pos

  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    setWindowH(window.screen.height);
    setWindowW(window.screen.width);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
  });

  // Generate horizontal lines separated by 100px
  // TODO use canvas instead to draw lines
  const horizontalLines = [];
  for (let y = pos.y % space; y < windowH; y += space) {
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
  for (let x = pos.x % space; x < windowW; x += space) {
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

  for (const key in state) {
    const [x, y] = key.split(",");
    const tile = (
      <Tile
        gridPos={pos}
        startingAbsolutePos={{ x: Number(x) * space, y: Number(y) * space }}
        letter={state[key]}
        key={key}
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
      onMouseDown={(e) => {
        // Only start grid dragging if we clicked on the container itself
        if (e.target === e.currentTarget) {
          setIsDragging(true);
        }
      }}
      className="h-full w-full bg-white text-black absolute"
    >
      {horizontalLines}
      {verticalLines}
      {tiles}
      <div className="fixed top-1 left-1">
        {pos.x},{pos.y}
      </div>
    </div>
  );
}
