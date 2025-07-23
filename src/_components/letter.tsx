"use client";
import { useEffect, useState } from "react";
import { position } from "@/types";

interface props {
	// the current position of the grid
  gridPos: position;
  letter?: string;
  startPos?: position;
  size?: number;
}

const closestMultiple = (number: number, multiple: number) => {
  return Math.round(number / multiple) * multiple;
};

export default function Letter({
  gridPos,
  letter = "A",
  startPos = { x: 100, y: 100 },
  size = 50,
}: props) {

	// the position of this letter relative to the screen
  const [screenPos, setScreenPos] = useState<position>(startPos);

	// the absolute position of this letter (i.e. relative to the infinite grid)
  const [absolutePosition, setAbsolutePosition] = useState<position>({
    x: gridPos.x + screenPos.x,
    y: gridPos.y + screenPos.y,
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
      setAbsolutePosition((prev) => ({
        x: closestMultiple(prev.x, size),
        y: closestMultiple(prev.y, size),
      }));
    };
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, size]);

  return (
    <div
      onMouseDown={(e) => {
        setIsDragging(true);
      }}
      style={{
        position: "relative",
        top: screenPos.y,
        left: screenPos.x,
        height: size,
        width: size,
      }}
      className={`bg-amber-300 rounded-xl flex justify-center items-center z-50 cursor-grab active:cursor-grabbing`}
    >
      {letter}
      {absolutePosition.x},{absolutePosition.y}
    </div>
  );
}
