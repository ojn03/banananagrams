import { Types } from "mongoose";

export interface User {
  _id: Types.ObjectId;
  name: string;
}

export interface Room {
  _id: Types.ObjectId;
  name: string;
  room_code: string;
  users: User[];
}

export interface Bank {
  _id: Types.ObjectId;
  room: string;
  vault: Record<string, number>;
}
