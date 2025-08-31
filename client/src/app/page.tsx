import InfiniteGrid from "@/_components/grid/grid";
import GameStateProvider from "@/_components/context";
import { loadDictionary } from "@/actions/server";
import Wallet from "@/_components/wallet/wallet";
import TRPCProvider from "@/_components/trpcProvider";

export default async function Home() {
  const dictionary = loadDictionary();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <TRPCProvider>
        <GameStateProvider>
          <Wallet />
          <InfiniteGrid dictionary={dictionary} />
        </GameStateProvider>
      </TRPCProvider>
    </div>
  );
}

//TODO create a color scheme
