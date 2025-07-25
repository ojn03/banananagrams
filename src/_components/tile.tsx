"use client";
import { useEffect, useState } from "react";
import { position } from "@/types";
import useGameStateContext from "@/hooks/gameState";

interface props {
  // the current position of the grid
  gridPos: position;
  letter?: string;
  startingAbsolutePos?: position;
  size?: number;
}

const closestMultiple = (number: number, multiple: number) => {
  return Math.round(number / multiple) * multiple;
};

export default function Tile({
  gridPos,
  letter = "A",
  startingAbsolutePos = { x: 100, y: 100 },
  size = 50,
}: props) {
  const { moveTile } = useGameStateContext();

  // the absolute position of this letter (i.e. relative to the infinite grid)
  const [absolutePosition, setAbsolutePosition] =
    useState<position>(startingAbsolutePos);

  // the position of this tile relative to the screen
  const [screenPos, setScreenPos] = useState<position>({
    x: absolutePosition.x - gridPos.x,
    y: absolutePosition.y - gridPos.y,
  });

  const [isDragging, setIsDragging] = useState(false);

  // maintain the absolute position when panning the grid
  useEffect(() => {
    setScreenPos({
      x: absolutePosition.x + gridPos.x,
      y: absolutePosition.y + gridPos.y,
    });
  }, [gridPos, absolutePosition]);

  // enable dragging the letter around
  useEffect(() => {
    const handleDrag = (event: MouseEvent) => {
      if (isDragging) {
        setScreenPos((prev) => {
          return { x: prev.x + event.movementX, y: prev.y + event.movementY };
        });
        setAbsolutePosition((prev) => {
          return { x: prev.x + event.movementX, y: prev.y + event.movementY };
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // snap to grid
      const newAbsolutePosition = {
        x: closestMultiple(absolutePosition.x, size),
        y: closestMultiple(absolutePosition.y, size),
      };

      // Only move if position actually changed
      if (
        newAbsolutePosition.x !== startingAbsolutePos.x ||
        newAbsolutePosition.y !== startingAbsolutePos.y
      ) {
        // Update absolute position first
        setAbsolutePosition(newAbsolutePosition);

        // Then update game state
        moveTile(startingAbsolutePos, newAbsolutePosition);
      }
    };
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, moveTile, size, startingAbsolutePos, absolutePosition]);

  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation(); // Add this to prevent grid dragging
        setIsDragging(true);
      }}
      style={{
        position: "absolute",
        top: screenPos.y,
        left: screenPos.x,
        height: size,
        width: size,
      }}
      className={`bg-amber-300 rounded-xl flex justify-center items-center z-50 cursor-grab active:cursor-grabbing select-none`}
    >
      {letter}
      {absolutePosition.x},{absolutePosition.y}
    </div>
  );
}
