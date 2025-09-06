"use client";
import useGameModeContext from "@/hooks/gameMode";
import { redirect } from "next/navigation";
import TileProvider from "@/_components/context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gameMode } = useGameModeContext();
  if (gameMode === undefined) {
    redirect("/");
  }

  return <TileProvider>{children}</TileProvider>;
}