"use client";
import type { MultiplayerStateType } from "@/types";
import { trpc } from "@/utils/trpc";

export function WaitingRoom({ state }: { state: MultiplayerStateType; }) {
  const { user, room, setRoom } = state;

  const startGame = trpc.room.startGame.useMutation({
    onSuccess: (room) => {
      setRoom({ ...room });
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  function onStart() {
    startGame.mutate(room.room_code);
  }

  const isHost = room.host === user._id;

  return (
    <div className="w-full h-full bg-neutral-300 flex items-center justify-evenly text-neutral-800">
      <div className="bg-white flex flex-col items-center justify-evenly text-neutral-800 gap-3 p-3">
        <h4>waiting room</h4>
        <div>room code: {room.room_code}</div>
        <div>players: {room.users.map((user) => user.name).join(",")}</div>

        {isHost && (
          <button
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
            onClick={onStart}
          >
            start Game
          </button>
        )}
      </div>
    </div>
  );
}
