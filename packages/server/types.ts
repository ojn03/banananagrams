import { Types } from "mongoose";
import { Server } from "socket.io";

export interface User {
  _id: Types.ObjectId;
  name: string;
}

export interface Room {
  _id: Types.ObjectId;
  room_code: string;
  host: string;
  hasBegun: boolean;
  users: User[];
}

export type BanananagramsSocket = Server<SocketEvents>;

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface SocketEvents {
  peel: (payload: { user: string; roomCode: string }) => void;
  joinRoom: (payload: { user: string; roomCode: string }) => void;
  roomUpdated: (room: Room) => void;
  addLetters: (letters: string[]) => void;
  userWon: (user: User) => void;
  error: (error : Error) => void
}

export interface Bank {
  _id: Types.ObjectId;
  room_code: string;
  vault: Map<string, number>;
}
