import InfiniteGrid from "@/_components/grid";
import GameStateProvider from "@/_components/context";
import { loadDictionary } from "@/actions/server";

export default async function Home() {
  const dictionary = loadDictionary();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <GameStateProvider>
        <InfiniteGrid dictionary={dictionary} />
      </GameStateProvider>
    </div>
  );
}
