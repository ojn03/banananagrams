"use client";
import InfiniteGrid from "@/_components/grid/grid";
import Wallet from "@/_components/wallet/wallet";
import useGameModeContext from "@/hooks/gameMode";
import useGameStateContext from "@/hooks/gameState";
import { User } from "@/types";
import { trpc } from "@/utils/trpc";
import { Dispatch, SetStateAction, useState } from "react";

//TODO create reusable components and split this file up
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

  const {
    user,
    room: { room_code, hasBegun },
    setUser,
  } = multiplayerState;

  return !(user._id && user.name) ? (
    <ChooseName setUser={setUser} />
  ) : room_code === "" ? (
    <JoinOrCreateRoom />
  ) : !hasBegun ? (
    <WaitingRoom />
  ) : (
    <Game dictionary={dictionary} />
  );
}

function WaitingRoom() {
  const { user, room, setRoom } = useGameStateContext().multiplayerState!;

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

function ChooseName({ setUser }: { setUser: Dispatch<SetStateAction<User>> }) {
  const [userNameInput, setUserNameInput] = useState("anonymous");
  const newUserMutation = trpc.user.createUser.useMutation({
    onSuccess: (user) => {
      setUser({ ...user });
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  function newUser() {
    newUserMutation.mutate(userNameInput);
  }

  return (
    <div className="w-full h-full bg-neutral-300 flex justify-center items-center ">
      <div className="bg-white flex flex-col justify-center items-center w-1/4 rounded-lg p-4 text-black">
        <h4 className="text-xl font-bold mb-2 text-neutral-800">
          Choose a Name
        </h4>
        <input
          type="text"
          required
          className="p-2 border-1 rounded w-full mb-2 outline-0 focus:ring focus:ring-black"
          value={userNameInput}
          placeholder="john doe"
          onChange={(e) => setUserNameInput(e.target.value)}
        />
        <button
          className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 cursor-pointer w-full "
          onClick={newUser}
        >
          submit
        </button>
      </div>
    </div>
  );
}

function JoinOrCreateRoom() {
  const [inputJoinCode, setInputJoinCode] = useState<string>("");
  const context = useGameStateContext();

  const { user, socket } = context.multiplayerState!;

  //TODO add a screen to wait for others to join the room
  const createRoomMutation = trpc.room.createRoom.useMutation({
    onError: (err) => {
      console.error(err.message);
    },
  });

  const createBankMutation = trpc.bank.createNewBank.useMutation({
    // onSuccess: (bank) => { //TODO
    //   setBank(bank.vault);
    // },
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
      .mutateAsync({
        roomName: "someRoom", //MAYBE either remove room name or let user pick one
        userId: user._id,
      })
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
            className="flex-1 p-2 border-[1.5] rounded w-full mb-2 outline-0 focus:ring focus:ring-black"
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
