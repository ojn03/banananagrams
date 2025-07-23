import InfiniteGrid from "@/_components/grid";
import Letter from "@/_components/letter";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <InfiniteGrid />
    </div>
  );
}
