"use client";
import InfiniteGrid from "@/_components/grid/grid";
import Wallet from "@/_components/wallet/wallet";
import useGameModeContext from "@/hooks/gameMode";
import useGameStateContext from "@/hooks/gameState";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

//TODO move setup to initializatino of gameSettings/mode
export default function Setup({ dictionary }: { dictionary: Set<string> }) {
  const { gameMode } = useGameModeContext();
  const { player, setPlayer, roomCode, setRoomCode } = useGameStateContext();

  //TODO check nullables arent null if multi

  return !player ? (
    <ChooseName setPlayer={setPlayer} />
  ) : gameMode === "multi" && roomCode == undefined ? (
    <JoinOrCreateRoom setRoomCode={setRoomCode!} />
  ) : (
    <Game dictionary={dictionary} />
  );
}

function ChooseName({ setPlayer }: { setPlayer: (name: string) => void }) {
  const newUserMutation = trpc.user.createUser.useMutation({
    onSuccess: (user) => {
      setPlayer(user._id);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  function newUser() {
    newUserMutation.mutate("anonymous"); //TODO take user input instead
  }

  return (
    <button className="w-full h-full" onClick={newUser}>
      pick a name
    </button>
  );
}

function JoinOrCreateRoom({
  setRoomCode,
}: {
  setRoomCode: (code: string) => void;
}) {
  const [inputCode, setInputCode] = useState<string>("");
  const { player } = useGameStateContext();

  const joinRoomMutation = trpc.room.addUserToRoom.useMutation({
    onSuccess: (room) => {
      setRoomCode(room.room_code);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  //TODO add a screen to wait for others to join the room
  const createRoomMutation = trpc.room.createRoom.useMutation({
    onSuccess: (room) => {
      setRoomCode(room.room_code);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  function joinRoom() {
    joinRoomMutation.mutate({
      roomCode: inputCode,
      userId: player,
    });
  }

  function newRoom() {
    createRoomMutation.mutate({
      roomName: "someRoom", //TODO make this a user input
      userId: player,
    });
  }

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
            onClick={joinRoom}
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
          >
            Join
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 m-2">- or -</p>
          <button
            onClick={newRoom}
            className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 w-full cursor-pointer"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}

function Game({ dictionary }: { dictionary: Set<string> }) {
  return (
    <div className="h-full w-full">
      <Wallet />
      <InfiniteGrid dictionary={dictionary} />
    </div>
  );
}
