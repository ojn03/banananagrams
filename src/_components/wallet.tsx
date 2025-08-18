"use client";
import useGameStateContext from "@/hooks/gameState";
import { useEffect, useState } from "react";
/** TODO 
 * 
 * create wallet specific tiles
 * update state to include wallet letters
 * enable drag and drop between wallet and grid
 * - from wallet to grid:
 *   ...
 * 
 * - from grid to wallet:
 *   ...
 * 
 * (peel) add one random word from from bank to wallet whenever grid is fully valid and wallet is empty
 * 
 * (dump - to be moved to its own component) replace one given tile from wallet with three other random tiles

*/
export default function Wallet() {
  const { wallet, spacing } = useGameStateContext();

  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    setLetters(wallet);
  }, [wallet]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dtoString = e.dataTransfer.getData("application/json");

    const dto = JSON.parse(dtoString);
    const dropData = dto["data"];

    switch (dto["type"]) {
      case "wallet":
        // TODO make drag and drop work within wallet
        console.log("wallet to wallet tile. do nothing");
        break;
      case "tile":
        break;
      default:
        console.log("Unknown drop type:", dto.type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        height: spacing * 1.5,
      }}
      className={`w-full bg-violet-400 top-0 z-10 relative flex justify-evenly items-center`}
    >
      {letters.map((letter, i) => {
        return <WalletTile letter={letter} spacing={spacing} key={i} />;
      })}
    </div>
  );
}

//TODO move wallet tile to its own file
//TODO enable dragging across wallet

function WalletTile({ letter, spacing }: { letter: string; spacing: number }) {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const dto = {
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
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      className="bg-blue-400 border-2 border-blue-500 rounded-lg shadow-lg flex justify-center items-center select-none"
      style={{
        height: spacing,
        width: spacing,
      }}
    >
      {letter}
    </div>
  );
}
