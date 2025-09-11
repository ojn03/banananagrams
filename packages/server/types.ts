import { Types } from "mongoose";
import { Server } from "socket.io";

export interface User {
  _id: Types.ObjectId;
  name: string;
}

export interface Room {
  _id: Types.ObjectId;
  name: string;
  room_code: string;
  host: string
  users: User[];
}

export type BanananagramsSocket = Server<ServerToClientEvents>

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  peel: (payload: {}) => void;
}

export interface Bank {
  _id: Types.ObjectId;
  room: string;
  vault: Record<string, number>;
}
