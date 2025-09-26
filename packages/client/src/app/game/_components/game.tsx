import Wallet from "@/app/game/_components/wallet/wallet";
import InfiniteGrid from "./grid/grid";


export default function Game({ dictionary }: { dictionary: Set<string>; }) {
  return (
    <div className="h-full w-full">
      <Wallet />
      <InfiniteGrid dictionary={dictionary} />
    </div>
  );
}
