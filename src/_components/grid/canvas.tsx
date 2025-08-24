import { Position } from "@/types";
import React, { useRef, useEffect } from "react";

export default function GridCanvas({
  pos,
  spacing,
  windowSize,
}: {
  pos: Position;
  spacing: number;
  windowSize: { width: number; height: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get device pixel ratio for crisp lines
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size using dpr
    canvas.width = windowSize.width * dpr;
    canvas.height = windowSize.height * dpr;
    canvas.style.width = windowSize.width + "px";
    canvas.style.height = windowSize.height + "px";

    // Scale the drawing context so everything draws at the correct size
    ctx.scale(dpr, dpr);

    // Disable image smoothing for crisp lines
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, windowSize.width, windowSize.height);

    // Set line style
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    ctx.beginPath();

    // Draw horizontal lines
    for (let y = -pos.y % spacing; y < windowSize.height; y += spacing) {
      const yPos = Math.round(y);
      ctx.moveTo(0, yPos);
      ctx.lineTo(windowSize.width, yPos);
    }

    // Draw vertical lines
    for (let x = -pos.x % spacing; x < windowSize.width; x += spacing) {
      const xPos = Math.round(x);
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, windowSize.height);
    }

    ctx.stroke();
  }, [pos, spacing, windowSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none", // Allow mouse events to pass through
        zIndex: 0,
      }}
    />
  );
}
