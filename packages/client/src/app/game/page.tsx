import { loadDictionary } from "@/actions/server";
import Game from "./_components/game";

export default async function Home() {
  const dictionary = loadDictionary();

  return <Game dictionary={dictionary} />;
}
