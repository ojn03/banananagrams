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
//TODO  toast for all console statements
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
  });

  const dumpMutation = trpc.bank.dump.useMutation({
    onSuccess: (newLetters) => {
      setWallet(wallet.concat(newLetters));
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const dumpAudio = new Audio("/dump.mp3");
  dumpAudio.volume = 0.5;

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
            removeBoardTile(new Position(x, y));
            dumpAudio.play();
          })
          .catch((e) => console.error(e));
        break;
      case "wallet":
        if (!wallet.includes(letter)) {
          return console.error(
            `letter ${letter} cannot be dumped as it does not exist in wallet`
          );
        }

        //FIXME make changes atomic so that if API call fails, wallet changes can be undone
        dumpMutation
          .mutateAsync({ roomCode: room.room_code, letter })
          .then(() => {
            removeWalletTile(letter);
            dumpAudio.play();
          })
          .catch((e) => console.error(e));
        break;
      default:
        return console.error("unknown drop type");
    }
  };

  const removeWalletTile = (letter: string) => {
    setWallet((prev) => {
      const letterIndex = prev.findIndex((l) => l == letter);
      prev.splice(letterIndex, 1);
      return prev;
    });
  };

  const removeBoardTile = (gridPos: Position) => {
    if (!(gridPos.toString() in board)) {
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

  const peelAudio = new Audio("/peel.mp3");
  peelAudio.volume = 0.5;

  useEffect(() => {
    socketRef.current = io(serverURL);
    const socket = socketRef.current;

    socket.on("roomUpdated", (newRoom) => {
      setRoom({ ...newRoom });
    });

    socket.on("peelResponse", (letters) => {
      setWallet((prev) => prev.concat(letters));
      peelAudio.play();
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
      console.log(
        isThisUser
          ? "congrats, you won!"
          : `${winner.name} won. you're a loser. do better`
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverURL]);

  const peel = () => {
    const canpeel = isSingleValidComponent(board) && wallet.length == 0;
    if (canpeel) {
      //TODO ensure socket is available
      socketRef?.current?.emit("peelRequest", {
        user: user._id,
        roomCode: room.room_code,
      });
    } else {
      console.error("cannot peel yet");
    }
  };

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
    peel,
    multiplayerState: {
      user,
      setUser,
      room,
      socket: socketRef.current!,
      setRoom,
    },
  };
}
