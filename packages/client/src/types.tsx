import { Socket } from 'socket.io-client';

export interface TileInfo {
  letter: string;
  valid: {
    vertical: boolean;
    horizontal: boolean;
  };
}

export interface User {
  name: string;
  id: string;
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


export type BanananagramsSocket = Socket<ServerToClientEvents>

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  peel: (payload: undefined) => void;
  joinRoom: (roomCode: string) => void
}