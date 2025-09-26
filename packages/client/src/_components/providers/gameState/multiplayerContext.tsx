"use client";
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

//MAYBE look into webrtc for p2p connections
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
        dumpMutation
          .mutateAsync({ roomCode: room.room_code, letter })
          .then(() => {
            removeTile(new Position(x, y));
          })
          .catch((e) => console.error(e));
        break;
      case "wallet":
        if (!wallet.includes(letter)) {
          return console.error(
            `letter ${letter} cannot be dumped as it does not exist in wallet`
          );
        }
        dumpMutation
          .mutateAsync({ roomCode: room.room_code, letter })
          .then(() => {
            const letterIndex = wallet.findIndex((l) => l == letter);
            wallet.splice(letterIndex, 1);
          })
          .catch((e) => console.error(e));

        break;
      default:
        return console.error("unknown drop type");
    }
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

  useEffect(() => {
    socketRef.current = io(serverURL);
    const socket = socketRef.current;

    socket.on("roomUpdated", (newRoom) => {
      setRoom({ ...newRoom });
    });

    //TODO better socket errors
    socket.on("error", (error) => {
      console.error("oopsies: ", error);
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
          : `${winner.name} won. you're a loser. do better`
      );
    });

    // MAYBE make peel manual. i.e user has to press space to call peel

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverURL]);

  useEffect(() => {
    const canpeel = isSingleValidComponent(board) && wallet.length == 0;
    if (canpeel) {
      //TODO ensure socket is available
      socketRef?.current?.emit("peel", {
        user: user._id,
        roomCode: room.room_code,
      });
    }
  });

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
