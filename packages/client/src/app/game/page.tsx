import { loadDictionary } from "@/actions/server";
import Setup from "./_components/setup";

export default async function Home() {
  const dictionary = loadDictionary();

  return <Setup dictionary={dictionary} />;
}
