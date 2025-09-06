"use client";
import { trpc } from "@/utils/trpc";
import useGameStateContext from "@/hooks/gameState";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gameMode, roomCode, setRoomCode, player, setPlayer } =
    useGameStateContext();
  if (gameMode === "multi" && setRoomCode === undefined) {
    throw Error("setRoomCode function must be defined for multiplayer games");
  }

  return player === undefined ? (
    <ChooseName />
  ) : gameMode === "multi" && roomCode === undefined ? (
    <JoinOrCreateRoom setRoomCode={setRoomCode!} />
  ) : (
    { children }
  );
}

function ChooseName() {
  return <div>pick a name</div>;
}

function JoinOrCreateRoom({
  setRoomCode,
}: {
  setRoomCode: (code: string) => void;
}) {
  const [inputCode, setInputCode] = useState<string>("");

  const joinRoom = trpc.room.addUserToRoom.useMutation({
    onSuccess: (room) => {
      // This runs when the mutation succeeds
      setRoomCode(room.room_code);
    },
  });

  function joinExistingRoom() {
    trpc.room.addUserToRoom.useMutation({});
  }

  function createNewRoom() {}

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-neutral-300">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md ">
        <div
          // onSubmit={joinExistingRoom}
          className="flex flex-col justify-center items-center text-black"
        >
          <h4 className="text-xl font-bold mb-2 text-neutral-800">Join Room</h4>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter room code"
            className="flex-1 p-2 border-2 rounded w-full mb-2 outline-0 focus:ring focus:ring-black"
          />
          <button
            onClick={joinExistingRoom}
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
          >
            Join
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 m-2">- or -</p>
          <button
            onClick={createNewRoom}
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}
