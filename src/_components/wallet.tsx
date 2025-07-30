interface props {
  letters: string[];
}

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
export default function Wallet({ letters }: props) {
  {
    return (
      <div className="w-full bg-violet-400 top-0 h-1/12 z-10 relative">
        Wallet
      </div>
    );
  }
}

function WalletTile({ letter }: { letter: string }) {
  return <div>{letter}</div>;
}
