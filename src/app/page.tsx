import InfiniteGrid from "@/_components/grid";
import GameStateProvider from "@/_components/context";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <GameStateProvider>
        <InfiniteGrid />
      </GameStateProvider>
    </div>
  );
}
