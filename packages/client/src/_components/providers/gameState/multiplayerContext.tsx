"use client"
import {
  BanananagramsSocket,
  DropData,
  Position,
  Room,
  TileDropData,
  TileInfo,
  User,
} from "@/types";
import { GameStateContextType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { trpc } from "@/utils/trpc";
import { isSingleValidComponent } from "@/utils/gameUtils";

//TODO look into webrtc for p2p connections
export function CreateMultiplayerContext(): GameStateContextType {
  const [wallet, setWallet] = useState<string[]>([]); // MAYBE make wallet a map kinda like bank
  const [board, setBoard] = useState<Record<string, TileInfo>>({});
  const socketRef = useRef<BanananagramsSocket>(null);
  const serverURL =
    process.env.NEXT_PUBLIC_BASE_SERVER || "http://localhost:3001";

  const [user, setUser] = useState<User>({ name: "", _id: "" });
  const [room, setRoom] = useState<Room>({
    _id: "",
    users: [],
    room_code: "",
    host: "",
    hasBegun: false,
    name: "",
  });

  //MAYBE move dumpmutation outside of gamestate context
  const dumpMutation = trpc.bank.dump.useMutation({
    onSuccess: (newLetters) => {
      setWallet(wallet.concat(newLetters));
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const dump = (dto: DropData) => {
    const letter = dto.data.letter as string;

    switch (dto.type) {
      case "tile":
        const {
          data: { x, y },
        } = dto as TileDropData;

        removeTile(new Position(x, y)); // FIXME check if mutate fails, before remove
        break;
      case "wallet":
        if (!wallet.includes(letter)) {
          return console.error(
            `letter ${letter} cannot be dumped as it does not exist in wallet`
          );
        }

        const letterIndex = wallet.findIndex((l) => l == letter);
        wallet.splice(letterIndex, 1); // FIXME check if mutate fails, before remove
        break;
      default:
        return console.error("unknown drop type");
    }

    dumpMutation.mutate({ roomCode: room.room_code, letter });
  };

  const removeTile = (gridPos: Position) => {
    if (!(gridPos.toString() in board)) {
      //TODO Toast
      return console.error(
        "attempting to remove inexistent position: ",
        gridPos.toString()
      );
    }

    setBoard((prev) => {
      delete prev[gridPos.toString()];
      return prev;
    });
  };

  const canPeel = () => isSingleValidComponent(board) && wallet.length == 0;

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(serverURL);
    }
    const socket = socketRef.current;

    socket.on("roomUpdated", (newRoom) => {
      setRoom({ ...newRoom });
    });

    socket.on("addLetters", (letters) => {
      setWallet((prev) => prev.concat(letters));
    });

    socket.on("userWon", (winner) => {
      const isThisUser = (user._id = winner._id);

      // TODO toast
      console.log(
        isThisUser
          ? "congrats, you won!"
          : `you're a loser. ${winner.name} won. better luck next time`
      );
    });

    // MAYBE make peel manual. i.e user has to press space to call peel
    if (canPeel()) {
      socket.emit("peel", { user: user._id, roomCode: room.room_code });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [canPeel, serverURL]);

  const moveTile = (oldPos: Position, newPos: Position) => {
    const prevPositionString = `${oldPos.x},${oldPos.y}`;
    const targetPositionString = `${newPos.x},${newPos.y}`;

    if (targetPositionString === prevPositionString) return;

    setBoard((prev) => {
      const newState = { ...prev };

      if (targetPositionString in newState) {
        // Target position is occupied, swap the tiles
        const temp = newState[prevPositionString];
        newState[prevPositionString] = newState[targetPositionString];
        newState[targetPositionString] = temp;
      } else {
        // Target position is empty, just move the tile
        newState[targetPositionString] = newState[prevPositionString];
        delete newState[prevPositionString];
      }

      return newState;
    });
  };

  //Adds a tile from wallet to board
  const addTile = (letter: string, gridPos: Position) => {
    //TODO enable swapping grid and wallet tiles
    if (wallet.includes(letter) && !(gridPos.toString() in board)) {
      setBoard((prev) => {
        return {
          ...prev,
          [gridPos.toString()]: {
            letter,
            valid: {
              vertical: true,
              horizontal: true,
            },
          },
        };
      });
      setWallet((prev) => {
        const prevIndex = prev.findIndex((l) => l == letter);
        return prev.filter((_, index) => index !== prevIndex);
      });
    } else {
      //TODO Toast
      console.error("letter " + letter + " does not exist in wallet");
    }
  };

  return {
    dump,
    spacing: 50,
    board,
    moveTile,
    addTile,
    wallet,

    multiplayerState: {
      user,
      setUser,
      room,
      socket: socketRef.current!,
      setRoom,
    },
  };
}
