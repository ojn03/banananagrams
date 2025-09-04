import InfiniteGrid from "@/_components/grid/grid";
import { loadDictionary } from "@/actions/server";
import Wallet from "@/_components/wallet/wallet";

export default async function Home() {
  const dictionary = loadDictionary();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Wallet />
      <InfiniteGrid dictionary={dictionary} />
    </div>
  );
}
//TODO create a color scheme