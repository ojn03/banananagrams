"use client";
import { GameMode } from "@/types";
import { useState } from "react";
import TileProvider from "@/_components/context";

export function ChoooseGameMode({ children }: { children: React.ReactNode }) {
  const [gameMode, setGameMode] = useState<GameMode>();

  return gameMode === undefined ? (
    <SelectMode setGameMode={setGameMode} />
  ) :  (
    <TileProvider gameMode={gameMode}>{children}</TileProvider>
  );
}

function SelectMode({
  setGameMode,
}: {
  setGameMode: (mode: GameMode) => void;
}) {
  return (
    <div className="bg-neutral-300 flex flex-col h-full w-full justify-center items-center">
      <button
        onClick={() => setGameMode("multi")}
        className="bg-neutral-700 h-10 w-45 m-10 rounded-lg"
      >
        multiplayer
      </button>
      <button
        onClick={() => setGameMode("single")}
        className="bg-neutral-700 h-10 w-45 m-10 rounded-lg"
      >
        single player
      </button>
    </div>
  );
}

// function chooseName(){

// }

// function JoinOrCreateRoom({
//   setRoomCode,
// }: {
//   setRoomCode: (code: string) => void;
// }) {
//   const [inputCode, setInputCode] = useState<string>("");

//   function joinExistingRoom(e: React.FormEvent) {
//     trpc.room.addUserToRoom(e.event)

//   }

//   function createNewRoom() {


//   }

//   return (
//     <div className="w-full h-full flex flex-col justify-center items-center bg-neutral-300">
//       <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md ">
//         <form onSubmit={joinExistingRoom} className="flex flex-col justify-center items-center text-black">
//           <h4 className="text-xl font-bold mb-2 text-neutral-800">Join Room</h4>
//           <input
//             type="text"
//             value={inputCode}
//             onChange={(e) => setInputCode(e.target.value)}
//             placeholder="Enter room code"
//             className="flex-1 p-2 border-2 rounded w-full mb-2 outline-0 focus:ring focus:ring-black"
//           />
//           <button
//             type="submit"
//             className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
//           >
//             Join
//           </button>
//         </form>

//         <div className="text-center">
//           <p className="text-gray-500 m-2">- or -</p>
//           <button
//             onClick={createNewRoom}
//             className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
//           >
//             Create New Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
