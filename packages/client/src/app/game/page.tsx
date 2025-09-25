import { loadDictionary } from "@/actions/server";
import InfiniteGrid from "@/_components/grid/grid";
import Wallet from "@/_components/wallet/wallet";

export default async function Home() {
  const dictionary = loadDictionary();

  return <Game dictionary={dictionary} />;
}
function Game({ dictionary }: { dictionary: Set<string> }) {
  return (
    <div className="h-full w-full">
      <Wallet />
      <InfiniteGrid dictionary={dictionary} />
    </div>
  );
}
