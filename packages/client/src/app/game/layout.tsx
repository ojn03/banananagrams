"use client";
import useGameModeContext from "@/hooks/gameMode";
import { redirect } from "next/navigation";
import GameStateProvider from "@/_components/providers/gameState";
import TRPCProvider from "@/_components/providers/trpc";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gameMode } = useGameModeContext();
  if (gameMode === undefined) {
    redirect("/");
  }

  return (
    <TRPCProvider>
      <GameStateProvider>{children}</GameStateProvider>;
    </TRPCProvider>
  );
}
