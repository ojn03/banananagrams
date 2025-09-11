"use client";
import InfiniteGrid from "@/_components/grid/grid";
import Wallet from "@/_components/wallet/wallet";
import useGameModeContext from "@/hooks/gameMode";
import useGameStateContext from "@/hooks/gameState";
import { User } from "@/types";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

//TODO move setup to initializatino of gameSettings/mode
export default function Setup({ dictionary }: { dictionary: Set<string> }) {
  const { gameMode } = useGameModeContext();
  const { multiplayerState } = useGameStateContext();

  if (gameMode === "single") {
    return <Game dictionary={dictionary} />;
  }

  if (multiplayerState === undefined) {
    throw new Error("multiplayer state not defined");
  }

  const { user, roomCode, setRoomCode, setUser } = multiplayerState;

  return !(user.id && user.name) ? (
    <ChooseName setUser={setUser} />
  ) : roomCode === "" ? (
    <JoinOrCreateRoom />
  ) : (
    <Game dictionary={dictionary} />
  );
}

function ChooseName({ setUser }: { setUser: (user: User) => void }) {
  const newUserMutation = trpc.user.createUser.useMutation({
    onSuccess: (user) => {
      setUser({ id: user._id, name: user.name });
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

function JoinOrCreateRoom() {
  const [inputJoinCode, setInputJoinCode] = useState<string>("");
  const context = useGameStateContext();

  const { setBank } = context;

  const { user, setUser, roomCode, setRoomCode } = context.multiplayerState!;

  const joinRoomMutation = trpc.room.addUserToRoom.useMutation({
    onSuccess: (room) => {
      setRoomCode!(room.room_code);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  //TODO add a screen to wait for others to join the room
  const createRoomMutation = trpc.room.createRoom.useMutation({
    onSuccess: (room) => {
      setRoomCode(room.room_code);
      return room;
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const createBankMutation = trpc.bank.createNewBank.useMutation({
    onSuccess: (bank) => {
      setBank(bank.vault);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  function joinRoom() {
    joinRoomMutation.mutate({
      roomCode: inputJoinCode,
      userId: user.id,
    });

    createBankMutation.mutate(roomCode!);
  }

  function newGame() {
    createRoomMutation.mutate({
      roomName: "someRoom", //TODO make this a user input
      userId: user.id,
    });

    createBankMutation.mutate(roomCode!);
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
            value={inputJoinCode}
            onChange={(e) => setInputJoinCode(e.target.value)}
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

function Game({ dictionary }: { dictionary: Set<string> }) {
  return (
    <div className="h-full w-full">
      <Wallet />
      <InfiniteGrid dictionary={dictionary} />
    </div>
  );
}
