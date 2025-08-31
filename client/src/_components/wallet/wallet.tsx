"use client";
import useGameStateContext from "@/hooks/gameState";
import { useEffect, useState } from "react";
import { WalletTile } from "./WalletTile";
import { trpc } from "@/utils/trpc";
/** TODO
 *
 * enable drag and drop between wallet and grid
 *
 * - from grid to wallet:
 *   ...
 *
 */
export default function Wallet() {
  const { isLoading, refetch, error, data } = trpc.hello.useQuery();

  const { wallet, spacing } = useGameStateContext();

  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    setLetters(wallet);
  }, [wallet]);
  if (isLoading) return null;
  if (error) return <div>Error: {error.message}</div>;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDragOver={handleDragOver}
      style={{
        height: spacing * 1.5,
      }}
      className={`w-full bg-neutral-800 top-0 z-10 relative flex justify-evenly items-center`}
    >
      {letters.map((letter, i) => {
        return <WalletTile letter={letter} spacing={spacing} key={i} />;
      })}
      {data}
    </div>
  );
}
