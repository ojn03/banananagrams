import { DropData } from "@/types";
import { DumpIcon } from "./svgs";
import useGameStateContext from "@/hooks/gameState";

export default function Dump() {
  const { dump } = useGameStateContext();

  // TODO polymorphism
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const dtoString = e.dataTransfer.getData("application/json");

    const dto = JSON.parse(dtoString);
    const dropData: DropData = dto;

    dump(dropData);
  };

  return (
    <div className="fixed bottom-5 right-5 w-20 h-20" onDrop={handleDrop}>
      <DumpIcon />
    </div>
  );
}
