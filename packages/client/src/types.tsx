import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

export interface TileInfo {
  letter: string;
  valid: {
    vertical: boolean;
    horizontal: boolean;
  };
}

export interface User {
  name: string;
  _id: string;
}

export interface Room {
  _id: string;
  room_code: string;
  host: string;
  hasBegun: boolean;
  users: User[];
}

export interface Bank {
  _id: string;
  room: string;
  vault: Record<string, number>;
}

export interface DropData {
  type: string;
  data: Record<string, unknown>;
}

export interface TileDropData extends DropData {
  type: "tile";
  data: {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    letter: string;
  };
}

export interface WalletDropData extends DropData {
  type: "wallet";
  data: {
    letter: string;
    x: number;
    y: number;
    mouseX: number;
    mouseY: number;
  };
}

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }
}

export type GameMode = "single" | "multi";

export type BanananagramsSocket = Socket<SocketEvents>;

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface SocketEvents {
  peel: (payload: { user: string; roomCode: string }) => void;
  joinRoom: (payload: { user: string; roomCode: string }) => void; // MAYBE do this through http route instead
  roomUpdated: (room: Room) => void;
  addLetters: (letters: string[]) => void;
  userWon: (user: User) => void;
  error: (error: Error) => void;
}

//TODO toast notis for errors, peel, dump, etc
//TODO add multiselect
//MAYBE move to hooks file
//MAYBE move gamestatecontexttype to types file
export interface MultiplayerStateType {
  room: Room;
  setRoom: (room: Room) => void;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  socket: BanananagramsSocket;
}

export interface GameStateContextType {
  board: Record<string, TileInfo>;
  wallet: string[];
  spacing: number;
  moveTile: (oldPos: Position, newPos: Position) => void;
  addTile: (letter: string, pos: Position) => void;
  dump: (dto: DropData) => void;
  multiplayerState?: MultiplayerStateType;
}
