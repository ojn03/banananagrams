import type { MultiplayerStateType } from "@/types";
import { trpc } from "@/utils/trpc";
import { useState } from "react";


export function JoinOrCreateRoom({ state }: { state: MultiplayerStateType; }) {
  const [inputJoinCode, setInputJoinCode] = useState<string>("");

  const { user, socket } = state;

  const createRoomMutation = trpc.room.createRoom.useMutation({
    onError: (err) => {
      console.error(err.message);
    },
  });

  const createBankMutation = trpc.bank.createNewBank.useMutation({
    onError: (err) => {
      console.error(err.message);
    },
  });

  async function joinRoom() {
    socket.emit("joinRoom", {
      roomCode: inputJoinCode,
      user: user._id,
    });
  }

  async function newGame() {
    await createRoomMutation
      .mutateAsync(user._id)
      .then((room) => {
        createBankMutation.mutate(room.room_code);
        socket.emit("joinRoom", { user: user._id, roomCode: room.room_code });
      });
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-neutral-300">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md ">
        <div className="flex flex-col justify-center items-center text-black">
          <h4 className="text-xl font-bold mb-2 text-neutral-800">Join Room</h4>
          <input
            type="text"
            required
            value={inputJoinCode}
            onChange={(e) => setInputJoinCode(e.target.value)}
            placeholder="Enter room code"
            className="flex-1 p-2 border-[1.5] rounded w-full mb-2 outline-0 focus:ring focus:ring-black" />
          <button
            onClick={joinRoom}
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
          >
            Join
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 m-2">- or -</p>
          <button
            onClick={newGame}
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
          >
            Create New Game
          </button>
        </div>
      </div>
    </div>
  );
}
